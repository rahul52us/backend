export interface RequestBodyDto {
    userId : string;
    bodyData : object,
    body : object
}

export interface CategoryDto {
    name : string,
    description? : string
}

export interface getCategoryDto {
    userId : string
}

export interface SuccessReturnDto {
    success : boolean,
    statusCode : number,
    message : string,
    data: any
}

export interface updateCategoryDto extends CategoryDto {
    id : string
}