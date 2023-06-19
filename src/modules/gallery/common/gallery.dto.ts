import * as Joi from 'joi'

export const CategorySchema = Joi.object({
    name : Joi.string().trim().message("category name is required").required(),
    adminUserId : Joi.string().trim().required()
}).options({
    abortEarly: false,
  });

export const UpdateCategorySchema = Joi.object({
    name : Joi.string().trim().message("category name is required").required(),
    adminUserId : Joi.string().trim().required(),
    id : Joi.string().trim().required()
}).options({
    abortEarly: false,
  });

export const CreateGallerySchema = Joi.object({
    image : Joi.string().trim().message("image is required").required(),
    adminUserId : Joi.string().trim().required(),
    categoryId : Joi.string().trim().required()
}).options({
    abortEarly: false,
  });

export const GetCategorySchema = Joi.object({
    userId : Joi.string().trim().required()
})

export interface GalleryCategoryBody {
    name : string
}

export interface GalleryDataBody {
    image : string,
    categoryId : string
}

export interface GallerySuccessReturnDto {
    success : boolean,
    message : string,
    data : any,
    statusCode : number
}