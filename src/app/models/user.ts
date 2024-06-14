export interface User {
    id: number;
    firstName: string;
    lastName: string;
    login: string;
    password: string;
    age: number;
    role: string;
}

const emptyUser = (): User => ({
    id: 0,
    firstName: '',
    lastName: '',
    login: '',
    password: '',
    age: 0,
    role: 'ROLE_GUEST'
});

export const createUser = <T extends Partial<User>>(initialValues: T): User & T => {
    return Object.assign(emptyUser(), initialValues);
};