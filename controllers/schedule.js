const { WorkingSchedule, TimeSlot, Product } = require('../models');

// Get working schedule for a product
const getWorkingSchedule = async (req, res) => {
  try {
    const { productId } = req.params;

    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Get working schedule
    const schedule = await WorkingSchedule.findAll({
      where: { productId },
      include: [
        {
          model: TimeSlot,
          as: 'timeSlots',
        },
      ],
      order: [
        ['dayOfWeek', 'ASC'],
        [{ model: TimeSlot, as: 'timeSlots' }, 'startTime', 'ASC'],
      ],
    });

    // Format response
    const formattedSchedule = schedule.map((day) => ({
      id: day.id,
      dayOfWeek: day.dayOfWeek,
      dayName: getDayName(day.dayOfWeek),
      isOpen: day.isOpen,
      openAllDay: day.openAllDay,
      isClosed: day.isClosed,
      timeSlots: day.timeSlots.map((slot) => ({
        id: slot.id,
        startTime: slot.startTime,
        endTime: slot.endTime,
        label: slot.label,
      })),
    }));

    res.status(200).json({
      success: true,
      data: formattedSchedule,
    });
  } catch (error) {
    console.error('Error fetching working schedule:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch working schedule',
      error: error.message,
    });
  }
};

// Update working schedule for a product
const updateWorkingSchedule = async (req, res) => {
  try {
    const { productId } = req.params;
    const { schedule } = req.body;

    if (!schedule || !Array.isArray(schedule)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid schedule data',
      });
    }

    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Start transaction
    const transaction = await WorkingSchedule.sequelize.transaction();

    try {
      // Delete existing schedule
      await WorkingSchedule.destroy({
        where: { productId },
        transaction,
      });

      // Create new schedule
      for (const day of schedule) {
        const { dayOfWeek, isOpen, openAllDay, isClosed, timeSlots } = day;

        // Create working schedule
        const workingSchedule = await WorkingSchedule.create(
          {
            productId,
            dayOfWeek,
            isOpen,
            openAllDay,
            isClosed,
          },
          { transaction },
        );

        // Create time slots if applicable
        if (
          isOpen &&
          !openAllDay &&
          !isClosed &&
          timeSlots &&
          Array.isArray(timeSlots)
        ) {
          for (const slot of timeSlots) {
            await TimeSlot.create(
              {
                scheduleId: workingSchedule.id,
                startTime: slot.startTime,
                endTime: slot.endTime,
                label: slot.label,
              },
              { transaction },
            );
          }
        }
      }

      // Commit transaction
      await transaction.commit();

      // Get updated schedule
      const updatedSchedule = await WorkingSchedule.findAll({
        where: { productId },
        include: [
          {
            model: TimeSlot,
            as: 'timeSlots',
          },
        ],
        order: [
          ['dayOfWeek', 'ASC'],
          [{ model: TimeSlot, as: 'timeSlots' }, 'startTime', 'ASC'],
        ],
      });

      // Format response
      const formattedSchedule = updatedSchedule.map((day) => ({
        id: day.id,
        dayOfWeek: day.dayOfWeek,
        dayName: getDayName(day.dayOfWeek),
        isOpen: day.isOpen,
        openAllDay: day.openAllDay,
        isClosed: day.isClosed,
        timeSlots: day.timeSlots.map((slot) => ({
          id: slot.id,
          startTime: slot.startTime,
          endTime: slot.endTime,
          label: slot.label,
        })),
      }));

      res.status(200).json({
        success: true,
        message: 'Working schedule updated successfully',
        data: formattedSchedule,
      });
    } catch (error) {
      // Rollback transaction
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error updating working schedule:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update working schedule',
      error: error.message,
    });
  }
};

// Helper function to get day name
function getDayName(dayOfWeek) {
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  return days[dayOfWeek];
}

module.exports = {
  getWorkingSchedule,
  updateWorkingSchedule,
};
