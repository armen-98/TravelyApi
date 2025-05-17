'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Step 1: Get all subcategories (categories with parentId)
      const subcategories = await queryInterface.sequelize.query(
        `SELECT "id", "title", "parentId" FROM "Categories" WHERE "parentId" IS NOT NULL`,
        {
          type: queryInterface.sequelize.QueryTypes.SELECT,
        },
      );

      if (subcategories.length === 0) {
        console.log('No subcategories found to add images to');
        return;
      }

      console.log(
        `Found ${subcategories.length} subcategories to add images to`,
      );

      // Step 2: Create image records for each subcategory
      const imageRecords = [];
      const categoryUpdates = [];
      const now = new Date();

      // Create themed image paths based on category titles
      for (const subcategory of subcategories) {
        // Create a slug from the title for the image filename
        const slug = subcategory.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

        // Create image record
        imageRecords.push({
          full: `https://static-new.lhw.com/HotelImages/Final/LW0430/lw0430_177729896_720x450.jpg`,
          thumb: `https://static-new.lhw.com/HotelImages/Final/LW0430/lw0430_177729896_720x450.jpg`,
          categoryId: subcategory.id,
          createdAt: now,
          updatedAt: now,
        });
      }

      // Step 3: Bulk insert the image records
      console.log(`Inserting ${imageRecords.length} image records`);
      const images = await queryInterface.bulkInsert('Images', imageRecords, {
        returning: true,
      });

      // Step 4: Update each subcategory with its image ID
      for (let i = 0; i < subcategories.length; i++) {
        categoryUpdates.push({
          id: subcategories[i].id,
          imageId: images[i].id,
        });
      }

      // Step 5: Update the categories with their image IDs
      console.log(
        `Updating ${categoryUpdates.length} subcategories with image IDs`,
      );
      for (const update of categoryUpdates) {
        await queryInterface.sequelize.query(
          `UPDATE "Categories" SET "imageId" = ${update.imageId} WHERE id = ${update.id}`,
        );
      }

      console.log('Successfully added images to all subcategories');
      return;
    } catch (error) {
      console.error('Error in subcategory images seeder:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Step 1: Get all subcategories with images
      const subcategories = await queryInterface.sequelize.query(
        `SELECT c.id, c."imageId" FROM "Categories" c 
       WHERE c.parentId IS NOT NULL AND c."imageId" IS NOT NULL`,
        { type: Sequelize.QueryTypes.SELECT },
      );

      if (subcategories.length === 0) {
        return;
      }

      // Step 2: Get the image IDs
      const imageIds = subcategories
        .map((cat) => cat.imageId)
        .filter((id) => id);

      // Step 3: Set imageId to NULL for all subcategories
      await queryInterface.sequelize.query(
        `UPDATE "Categories" SET "imageId" = NULL 
       WHERE parentId IS NOT NULL AND "imageId" IS NOT NULL`,
      );

      // Step 4: Delete the images
      if (imageIds.length > 0) {
        await queryInterface.bulkDelete('Images', {
          id: { [Sequelize.Op.in]: imageIds },
        });
      }

      console.log('Successfully removed images from subcategories');
      return;
    } catch (error) {
      console.error('Error in subcategory images seeder down method:', error);
      throw error;
    }
  },
};
