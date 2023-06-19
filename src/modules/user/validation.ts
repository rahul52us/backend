import * as Joi from "joi";

export const RegisterBodySchema = Joi.object({
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
  username: Joi.string().trim().email().required(),
  password: Joi.string().trim().required(),
  adminType: Joi.string().valid("admin", "student", "teacher", "staff"),
}).options({
  abortEarly: false,
});

export const LoginBodySchema = Joi.object({
  username: Joi.string().trim().message('username is required').required(),
  password: Joi.string().trim().message('password is required').required(),
}).options({
  abortEarly: false,
});

export const ChangePasswordBOdySchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().required(),
}).options({
  abortEarly: false,
});

export const ChangeStatusBodySchema = Joi.object({
  userId: Joi.string().required(),
  status: Joi.boolean().required(),
}).options({
  abortEarly: false,
});

export const UpdatePermissionSchema = Joi.object({
  id: Joi.string().required(),
  adminUserId: Joi.string().required(),
  student: Joi.array(),
  teacher: Joi.array(),
  permission: Joi.array(),
});

export const GetUserCountSchema = Joi.object({
  adminUserId: Joi.string().required()
});

export const GetUserWebCountSchema = Joi.object({
  adminUserId: Joi.string().required()
});
