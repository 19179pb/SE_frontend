export interface Information {
    id?: number;
    title?: string;
    content?: string;
    link?: string;
    addDate?: Date;
    remainder?: Date;
    isPublic: boolean;
    categoryName?: string;
}

export interface Sort {

}

export interface PagedRequest {
    page: number;
    size: number;
    sortRow: string;
    sortDir: string;
}

export interface Pageable {
    pageNumber: number;
    pageSize: number;
  

}

export interface Content {
    content: Information[];
    pageable: Pageable;
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
}

const emptyInformation = (): Information => ({
    id: undefined,
    title: undefined,
    content: undefined,
    link: undefined,
    addDate: new Date(),
    remainder: undefined,
    isPublic: false,
    categoryName: undefined 
});

export const createInformation = <T extends Partial<Information>>(initialValues: T): Information & T => {
    return Object.assign(emptyInformation(), initialValues);
};