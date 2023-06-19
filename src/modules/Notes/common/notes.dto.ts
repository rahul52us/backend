export interface SuccessNotesReturnDto {
    success : boolean,
    message : string,
    data : any,
    statusCode : number
}

export interface CreateNotesCaegoryDto {
    name : string,
    description : string,
    startYear : string,
    endYear : string,
}

export interface UpdateNotesCategoryDto extends CreateNotesCaegoryDto {
    id : string
}

export interface getCategoryNotesDto {
    search? : string,
    startYear? : string,
    endYear? : string,
    limit? : number,
    page? : number,
    adminUserId :string,
    createdBy?: string
}

export interface CreateNotesDto {
    categoryId : string,
    title : string,
    description : string,
    isFree : boolean,
    file: any
}