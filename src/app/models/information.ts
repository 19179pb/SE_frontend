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