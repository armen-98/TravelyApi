const Joi = require('@hapi/joi');
const updateProfile = (data, translate) => {
  const schema = Joi.object({
    firstName: Joi.string().max(255).optional(),
    lastName: Joi.string().max(255).optional(),
    email: Joi.string().email().max(255).optional(),
    url: Joi.string()
      .uri()
      .max(255)
      .optional()
      .messages({
        'string.uri': translate('url_invalid'),
      }),
    description: Joi.string().max(1000).optional(),
  });

  return schema.validate(data);
};

const updateNotificationSetting = (data) => {
  const schema = Joi.object({
    notificationsEnabled: Joi.boolean(),
  });

  return schema.validate(data);
};

module.exports = { updateProfile, updateNotificationSetting };
