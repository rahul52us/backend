interface PermissionStatus {
  teacher : [],
  student : [],
  changeStatus:[],
  permission:[],
  dashboard:[],
  userId?:string
}

export interface StaffInfo {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  phoneNumber: string;
  pic?: string;
  adminUserId: string;
  createdBy: string;
  fatherName: string;
  motherName: string;
  sibling?: number;
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

export interface UpdateStaffInfo {
  id: string;
  firstName?: string;
  lastName?: string;
  username: string;
  phoneNumber?: string;
  pic?: string;
  adminUserId: string;
  fatherName?: string;
  motherName?: string;
  sibling?: number;
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

export interface getStaffBodyDto {
  page: number;
  status: string;
  adminUserId: string;
  createdBy:string,
  limit:number,
  search:string
}

export interface StaffSuccessReturnDto {
  success: boolean;
  data: any;
  message: string;
  statusCode: number;
}

export interface getSingleStafftBodyDto {
  id: string;
}

export interface SingleStaffReturnDto {
  success: boolean;
  data: any;
  message: string;
  statusCode: number;
}
