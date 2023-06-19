interface PermissionStatus {
  teacher : [],
  student : [],
  changeStatus:[],
  permission:[],
  dashboard:[],
  userId?:string
}

export interface TeacherInfo {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  phoneNumber: string;
  pic?: string;
  permission: PermissionStatus,
  fatherName: string;
  motherName: string;
  sibling?: number;
  emergencyNumber?: string;
  nickName?: string;
  description?: string;
  dob: string;
  country?: string;
  state?: string;
  city?: string;
  address1?: string;
  address2?: string;
  zipCode?: string;
  facebook?: string;
  instagram?: string;
  linkedIn?: string;
  twitter?: string;
  youtube?: string;
  gmail?: string;
  refrenceVideo?: string;
  picture?: string;
  backgroundPicture?: string;
  details?: string;
  skill?: string;
  profession?: string;
  expirience?: string;
}

export interface UpdateTeacherInfo extends TeacherInfo {
  id: string;
}

export interface getTeacherBodyDto {
  page: number;
  status: string;
  limit?:number;
  search? :string
}

export interface getUserTeacherBodyDto {
  userId: string
}

export interface getSingleTeacherBodyDto {
  id: string;
}

export interface TeacherReturnSuccessdto {
  success: boolean;
  message: string;
  statusCode: number;
  data: any;
}

export interface ReturnSuccessUpdateTeacher {
  success: boolean;
  message: string;
  statusCode: number;
  data: any;
}
