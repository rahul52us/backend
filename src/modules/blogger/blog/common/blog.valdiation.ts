import * as Joi from 'joi'

export const CreateBlogValidation = Joi.object({
    title : Joi.string().trim().message("blog title is required").required(),
    content : Joi.string().trim().message("blog content is required").required(),
    userId : Joi.string().trim().message('userId is required field').required(),
}).options({
    abortEarly: false,
});