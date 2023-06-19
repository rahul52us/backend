import * as Joi from 'joi';

export const VideosCreateCategoryValidation = Joi.object({
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
}).options({
    abortEarly: false,
})

export const VideosUpdatedCategoryValidation = Joi.object({
  id: Joi.string().trim().required().messages({
    'string.empty': 'Id is required',
  }),
  name: Joi.string()
  .trim()
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
  .min(20)
  .max(900)
  .messages({
    'string.base': 'Description should be a string',
    'string.empty': 'Description is required',
    'string.min': 'Description should have a minimum length of {#limit}',
    'string.max': 'Description should have a maximum length of {#limit}',
  }),
}).options({
  abortEarly: false,
})