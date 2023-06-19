export interface CreateCommentDto {
    content : string,
    parentId? : string,
    blogId : string
}

export interface GetCommentDto {
    page : number,
    blogId : string,
    commentId : any
}

export interface ReturnSuccessDto {
    success : true ,
    message : string ,
    statusCode : number,
    data : any
}