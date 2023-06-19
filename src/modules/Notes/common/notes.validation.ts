import * as Joi from 'joi'
// Define a custom validation function for date format
const validateDateFormat = (value: Date, helpers: Joi.CustomHelpers): Date | Joi.ErrorReport => {
  const regex = /^(?:(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2})|(?:\d{4}\/(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01]))$/;
  const dateString = value.toString();

  if (!dateString.match(regex)) {
    return helpers.error('any.invalid', { custom: 'Date should be in MM/DD/YYYY or YYYY/MM/DD format' });
  }

  return value;
};

export const notesCreateCategoryValidation = Joi.object({
    name: Joi.string()
    .trim()
    .required()
    .min(3)
    .max(50)
    .messages({
      'string.base': 'Name should be a string',
      'string.empty': 'Name is required',
      'string.min': 'Name should have a minimum length of {#limit}',
      'string.max': 'Name should have a maximum length of {#limit}',
    }),
    adminUserId : Joi.string().trim().message('adminUserId is required field').required(),
    createdBy : Joi.string().trim().message('created By is required').required(),
    description: Joi.string()
    .trim()
    .required()
    .min(20)
    .max(900)
    .messages({
      'string.base': 'Description should be a string',
      'string.empty': 'Description is required',
      'string.min': 'Description should have a minimum length of {#limit}',
      'string.max': 'Description should have a maximum length of {#limit}',
    }),
    startYear: Joi.date().greater('now').message('Date should be greater than current date'),
    endYear: Joi.date()
    .greater(Joi.ref('startYear'))
    .min(Joi.ref('startYear'))
    .required()
    .messages({
      'any.required': 'endYear is a required field',
      'date.base': 'endYear must be a valid date',
      'date.greater': 'endYear must be greater than startYear',
      'date.min': 'endYear must be greater than or equal to startYear',
    }),
}).options({
    abortEarly: false,
})

export const getsCategoryValidation =  Joi.object({
  page: Joi.number().integer().strict().required().messages({
    'number.base': 'Page must be a valid number',
    'number.integer': 'Page must be an integer'
  }),
  limit: Joi.number().integer().strict().optional().messages({
    'number.base': 'Limit must be a valid number',
    'number.integer': 'Limit must be an integer'
  }),
  adminUserId: Joi.string(),
  createdBy: Joi.string().optional(),
  search: Joi.string().trim().allow('').optional(),
  startYear: Joi.string().empty('').custom((value, helpers) => {
    if (value && !/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
      return helpers.error('any.invalid');
    }
    return value;
  }, 'custom validation').messages({
    'any.invalid': 'Start year must be in DD/MM/YYYY format',
  }),
  endYear: Joi.string().empty('').custom((value, helpers) => {
    if (value && !/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
      return helpers.error('any.invalid');
    }
    return value;
  }, 'custom validation').messages({
    'any.invalid': 'End year must be in DD/MM/YYYY format',
  }),
})






