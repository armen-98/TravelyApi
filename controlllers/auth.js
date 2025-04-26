const { sendErrorEmail } = require('../services/nodemiler');
const signUp = async (req, res) => {
  try {
    console.log('data');
    return res.status(200).json({
      data: {},
      message: 'Success',
    });
  } catch (e) {
    console.log('Catch error for signUp', e);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

const signIn = async (req, res) => {
  try {
    console.log('data');
    throw new Error('sssss');
    return res.status(200).json({
      data: {},
      message: 'Success',
    });
  } catch (e) {
    console.log('Catch error for signIn', e);
    if (process.env.NODE_ENV !== 'development') {
      sendErrorEmail(e);
    }
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

module.exports = {
  signUp,
  signIn,
};
