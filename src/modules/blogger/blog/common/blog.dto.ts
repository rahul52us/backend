export interface CreateBlogDto {
    content : string,
    title: string
}

export interface ReturnSuccessDto {
    success : true ,
    message : string ,
    statusCode : number,
    data : any
}