import Joi from 'joi';
import { phone } from 'phone';

export function AuthenticationMiddleware(req, res, next) {
  const registerBody = Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    birthday: Joi.number().optional(),
    password: Joi.string().required().min(8).max(20),
    state: Joi.string().optional(),
    city: Joi.string().optional(),
    licenseNumber: Joi.string().optional(),
    phone: Joi.string()
      .required()
      .custom((value, helpers) => {
        const phoneNumber = phone(value);

        if (!phoneNumber.isValid) {
          return helpers.error('phone.invalid');
        }
        return value;
      })
      .messages({
        'phone.invalid': 'Invalid phone number'
      })
  });

  const result = registerBody.validate(req.body, { abortEarly: false });

  if (!result.error) {
    next();
  } else {
    return res.status(400).json({ message: result.error.message, error: result.error });
  }
}
