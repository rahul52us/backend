export interface ReturnSuccessTestimonial {
    success : boolean,
    message : string,
    statusCode : number,
    data : any
}

export interface TestimonialCreateDto {
    description : string,
    name : string,
    profession : string,
    pic? : string
}

export interface TestimonialUpdateDto extends TestimonialCreateDto {
    id : string,
    is_deleted : number
}

export interface TestimonialGetSingleDto {
    id : string
}

export interface TestimonialGetDto {
    userId : string,
    page : number,
    limit:number,
    search:string
}

export interface TestimonialDeleteSingleDto {
    id : string
}