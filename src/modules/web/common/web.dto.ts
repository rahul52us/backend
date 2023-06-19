import * as Joi from 'joi';

export const WebValidation = Joi.object({
  userId: Joi.string().trim().message('user id is required').required(),
  facebook: Joi.string().trim().allow('').optional(),
  instagram: Joi.string().trim().allow('').optional(),
  linkedIn: Joi.string().trim().allow('').optional(),
  twitter: Joi.string().trim().allow('').optional(),
  youtube: Joi.string().trim().allow('').optional(),
  email: Joi.string().trim().allow('').optional(),
  phoneNumber1: Joi.string()
    .trim()
    .message('phone numer is required')
    .required(),
  phoneNumber2: Joi.string().trim().allow('').optional(),
  logo: Joi.string().trim().message('logo link is required').required(),
  webName: Joi.string().trim().message('website name is required').required(),
  webLink1: Joi.string().trim().allow('').optional(),
  address: Joi.string().trim().message('address is required').required(),
  startTime: Joi.string().trim().allow('').optional(),
  endTime: Joi.string().trim().allow('').optional(),
}).options({
  abortEarly: false,
});

export interface WebBody {
  facebook: string;
  instagram: string;
  linkedIn: string;
  twitter: string;
  youtube: string;
  email: string;
  phoneNumber1: string;
  phoneNumber2: string;
  logo: string;
  webName: string;
  webLink1: string;
  address: string;
  startTime: string;
  endTime: string;
}
export interface WebSuccessReturnDto {
  success: boolean;
  message: string;
  data: any;
  statusCode: number;
}
