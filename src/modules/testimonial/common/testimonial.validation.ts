import * as Joi from 'joi'

export const TestimonialCreate = Joi.object({
    name : Joi.string().trim().message("name is required").required(),
    adminUserId : Joi.string().trim().message('adminUserId is required field').required(),
    description : Joi.string().trim().message('description is required field').required(),
    profession : Joi.string().trim().message('profession is required').required(),
    pic:Joi.string().trim().allow('').optional()
}).options({
    abortEarly: false,
});

export const TestimonialUpdateValidation = Joi.object({
    id : Joi.string().trim().message("id is required").required(),
    name : Joi.string().trim().message("name is required").required(),
    adminUserId : Joi.string().trim().message('adminUserId is required field').required(),
    description : Joi.string().trim().message('description is required field').required(),
    profession : Joi.string().trim().message('profession is required').required(),
    pic:Joi.string().trim().allow('').optional(),
    is_deleted: Joi.string().valid('0','1')
}).options({
    abortEarly: false,
});

export const TestimonialGetSingleValidation = Joi.object({
    id : Joi.string().trim().message("id is required").required(),
}).options({
    abortEarly: false,
});

export const TestimonialGetValidation = Joi.object({
    page: Joi.number().integer().strict().required().messages({
        'number.base': 'Page must be a valid number',
        'number.integer': 'Page must be an integer'
      }),
    limit: Joi.number().integer().strict().optional().messages({
        'number.base': 'Limit must be a valid number',
        'number.integer': 'Limit must be an integer'
      }),
    search: Joi.string().trim().allow('').optional(),
    userId: Joi.string().required(),
    }).options({
      abortEarly: false,
});

export const TestimonialDeleteValidation = Joi.object({
  id : Joi.string().trim().message("id is required").required(),
}).options({
    abortEarly: false,
});