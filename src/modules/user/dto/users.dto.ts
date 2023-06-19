import Joi from 'joi';

export interface RegisterBodyDto {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  adminType?: String;
}

export interface returnServiceRegisterDto  {
  message:string,
  data : object,
  success?:boolean
  statusCode : number
}

export interface UserInfo {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  adminType? : String;
}

export interface LoginBodyDto {
  username: string;
  password: string;
}

export interface ChangePasswordBodyDto {
  newPassword : string;
  oldPassword : string
}

export interface RequestBodyDto {
  userId : string;
  bodyData : object,
  body : object
}

export interface PasswordChangeServiceReturnDto {
  success : boolean,
  message : string,
  statusCode? : number
}

export interface PasswordChangeControllerFailed{
  error?: String,
  statusCode : number
}

export interface ChangeStatusBodyDto{
  status : Boolean,
  userId : string
}

export interface UpdatePermissionDto{
  adminUserId : string,
  id : string,
  student? : string,
  teacher? : string,
  permission? : string
}
export interface GetUsersCountDto {
  adminUserId : string
}

export interface GetUsersWebCountDto {
  adminUserId : string
}

export interface PasswordChangeControllerReturnDto extends PasswordChangeServiceReturnDto {}
