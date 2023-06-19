import { RegisterBodyDto } from "./users.dto";

type errorMsgDto = {
  statusCode: number;
  message: string;
};

export interface errorDto {
  error?: errorMsgDto;
}

export interface successReturnDto {
  statusCode? : number,
  success?: boolean;
  data?: any;
  message? : string;
}

export interface controllerReturnDto extends successReturnDto, errorDto {}

export interface successErrorReturnDto extends errorDto {
  success?: boolean;
  statusCode: number;
  message?: string;
}

export interface returnRegisterUserDto extends errorDto {
  user?: RegisterBodyDto;
}

interface successPasswordReturnDto {
  message:string,
  success?:boolean
  statusCode : number
}

export interface successUpdatePermissionReturn {
  message : string,
  success : boolean,
  statusCode : number
}

export interface successReturnGetUserCount {
  message : string,
  success : boolean,
  statusCode : number,
  data : Object
}

export interface passwordChangecontrollerReturnDto extends successPasswordReturnDto, errorDto {}
