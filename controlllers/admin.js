const createAdmin = async (req, res) => {
  try {
    console.log('data');
    return res.status(200).json({
      data: {},
      message: 'Success',
    });
  } catch (e) {
    console.log('Catch for createAdmin', e);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

module.exports = {
  createAdmin,
};
