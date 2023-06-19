import * as Joi from 'joi'

export const CreateCommentValidation = Joi.object({
    commentId: Joi.string().trim().optional().allow(null).messages({
        'string.base': 'commentId must be a string',
        'string.empty': 'commentId cannot be empty',
        'any.only': 'commentId must be null',
      }),
    blogId: Joi.string().trim().required().messages({
        'string.base': 'blogId must be a string',
        'string.empty': 'blogId cannot be empty',
        'any.required': 'blogId is required',
      }),
      content: Joi.string().trim().required().messages({
        'string.base': 'content must be a string',
        'string.empty': 'content cannot be empty',
        'any.required': 'content is required',
      }),
      userId: Joi.string().trim().required().messages({
        'string.base': 'userId must be a string',
        'string.empty': 'userId cannot be empty',
        'any.required': 'userId is required',
      }),
}).options({
    abortEarly: false,
});