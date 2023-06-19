interface PermissionStatus {
  teacher : [],
  student : [],
  staff : [],
  changeStatus:[],
  permission:[],
  dashboard:[],
  userId?:string
}

export interface StudentInfo {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  phoneNumber: string;
  startYear:string,
  endYear:string,
  pic?: string;
  adminUserId: string;
  createdBy: string;
  fatherName: string;
  motherName: string;
  sibling?: number;
  standard: number;
  medium: number;
  emergencyNumber?: string;
  nickName: string;
  description?: string;
  gender? : number;
  dob: string;
  country: string;
  state: string;
  city: string;
  address1: string;
  address2?: string;
  zipCode: string;
  permission: PermissionStatus,
  facebook?:string;
  instagram?:string;
  twitter?:string;
  youtube?:string;
  gmail?:string;
  linkedIn?:string;
  refrenceVideo?:string;
  backgroundPicture?:string;
  picture?:string;
  details?:string;
  skill?:string;
  profession?:string;
}

export interface UpdateStudentInfo {
  id: string;
  firstName?: string;
  lastName?: string;
  username: string;
  phoneNumber?: string;
  pic?: string;
  adminUserId: string;
  medium: number;
  fatherName?: string;
  motherName?: string;
  sibling?: number;
  standard?: number;
  gender? : number;
  emergencyNumber?: string;
  nickName?: string;
  description?: string;
  dob?: string;
  country?: string;
  state?: string;
  city?: string;
  address1?: string;
  address2?: string;
  zipCode?: string;
  permission: PermissionStatus,
  facebook?:string;
  instagram?:string;
  twitter?:string;
  youtube?:string;
  gmail?:string;
  linkedIn?:string;
  refrenceVideo?:string;
  backgroundPicture?:string;
  picture?:string;
  details?:string;
  skill?:string;
  profession?:string;
}

export interface getStudentBodyDto {
  page: number;
  status: string;
  standard: number;
  adminUserId: string;
  limit:number;
  search? : string,
  startYear:string,
  endYear:string
}

export interface getStudentReturnDto {
  success: boolean;
  data: any;
  message: string;
  statusCode: number;
}

export interface RegisterStudentReturnDto {
  success: boolean;
  data: any;
  message: string;
  statusCode: number;
}
export interface UpdateStudentReturnDto {
  success: boolean;
  data: any;
  message: string;
  statusCode: number;
}

export interface getSingleStudentBodyDto {
  id: string;
}

export interface SingleStudentReturnDto {
  success: boolean;
  data: any;
  message: string;
  statusCode: number;
}
