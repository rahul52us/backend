import * as Joi from 'joi';

export const TeacherBodySchema = Joi.object({
  firstName: Joi.string().trim().message('first Name is required').required(),
  lastName: Joi.string().trim().message('last Name is required').required(),
  username: Joi.string().trim().required(),
  password: Joi.string().trim().min(5).required(),
  confirm_password: Joi.string()
    .valid(Joi.ref('password'))
    .trim()
    .required()
    .messages({
      'any.only': 'Passwords do not match',
    }),
  pic: Joi.string().allow('').optional(),
  adminUserId: Joi.string().trim().required(),
  createdBy: Joi.string().trim().required(),
  permission: Joi.object().required(),
  gender: Joi.string().valid(0, 1, 2),
  fatherName: Joi.string()
    .trim()
    .min(2)
    .message('father Name is required')
    .required(),
  motherName: Joi.string()
    .trim()
    .min(2)
    .message('mother Name is required')
    .required(),
  nickName: Joi.string().trim().min(2),
  sibling: Joi.number(),
  medium: Joi.number(),
  dob: Joi.date()
    .max(new Date().toISOString())
    .message('date must be below the today date')
    .required(),
  phoneNumber: Joi.string().min(10).max(20).required(),
  emergencyNumber: Joi.string().min(10).max(20).allow('').optional(),
  expirence: Joi.string().min(10).max(20).allow('').optional(),
  description: Joi.string().max(300).allow('').optional(),
  address1: Joi.string().trim().min(2).max(120).required(),
  address2: Joi.string().trim().min(2).max(120).allow('').optional(),
  country: Joi.string().trim().min(2).max(120),
  state: Joi.string().trim(),
  city: Joi.string().trim(),
  zipCode: Joi.string().trim(),
  facebook: Joi.string().allow('').optional(),
  instagram: Joi.string().allow('').optional(),
  linkedIn: Joi.string().allow('').optional(),
  twitter: Joi.string().allow('').optional(),
  youtube: Joi.string().allow('').optional(),
  gmail: Joi.string().allow('').optional(),
  picture: Joi.string().allow('').optional(),
  backgroundPicture: Joi.string().allow('').optional(),
  refrenceVideo: Joi.string().allow('').optional(),
  details: Joi.string().allow('').optional(),
  profession: Joi.string().allow('').optional(),
  expirience: Joi.string().allow('').optional(),
  skill: Joi.string().allow('').optional(),
}).options({
  abortEarly: false,
});

export const UpdateTeacherBodySchema = Joi.object({
  id: Joi.string().trim().required(),
  firstName: Joi.string().trim().message('first Name is required'),
  lastName: Joi.string().trim().message('last Name is required'),
  username: Joi.string().trim().message('username is required'),
  pic: Joi.string().allow('').optional(),
  adminUserId: Joi.string().trim().required(),
  createdBy: Joi.string().trim().required(),
  fatherName: Joi.string().trim().min(2).message('father Name is required'),
  permission: Joi.object().required(),
  motherName: Joi.string().trim().min(2).message('mother Name is required'),
  nickName: Joi.string().trim().min(2),
  gender: Joi.string().valid(0, 1, 2),
  sibling: Joi.number(),
  medium: Joi.number(),
  dob: Joi.date()
    .max(new Date().toISOString())
    .message('date must be below the today date'),
  phoneNumber: Joi.string().min(10).max(20),
  emergencyNumber: Joi.string().min(10).max(20).allow('').optional(),
  expirence: Joi.string().min(10).max(20).allow('').optional(),
  description: Joi.string().max(300).allow('').optional(),
  address1: Joi.string().trim().min(2).max(120),
  address2: Joi.string().trim().min(2).max(120).allow('').optional(),
  country: Joi.string().trim().min(2).max(120),
  state: Joi.string().trim(),
  city: Joi.string().trim(),
  zipCode: Joi.string().trim(),
  facebook: Joi.string().allow('').optional(),
  instagram: Joi.string().allow('').optional(),
  linkedIn: Joi.string().allow('').optional(),
  twitter: Joi.string().allow('').optional(),
  youtube: Joi.string().allow('').optional(),
  gmail: Joi.string().allow('').optional(),
  picture: Joi.string().allow('').optional(),
  backgroundPicture: Joi.string().allow('').optional(),
  refrenceVideo: Joi.string().allow('').optional(),
  details: Joi.string().allow('').optional(),
  profession: Joi.string().allow('').optional(),
  expirience: Joi.string().allow('').optional(),
  skill: Joi.string().allow('').optional(),
}).options({
  abortEarly: false,
});

export const getTeacherSchema = Joi.object({
  page: Joi.number().integer().strict().required().messages({
    'number.base': 'Page must be a valid number',
    'number.integer': 'Page must be an integer'
  }),
  limit: Joi.number().integer().strict().optional().messages({
    'number.base': 'Limit must be a valid number',
    'number.integer': 'Limit must be an integer'
  }),
  search: Joi.string().trim().allow('').optional(),
  adminUserId: Joi.string().required(),
  createdBy: Joi.string().optional(),
  status: Joi.string().trim().valid('ACCEPTED', 'REJECTED').required()
}).options({
  abortEarly: false,
});

export const getUserTeacherSchema = Joi.object({
  userId: Joi.string().required(),
}).options({
  abortEarly: false,
});

export const getSingleTeacherSchema = Joi.object({
  id: Joi.string().required(),
});
