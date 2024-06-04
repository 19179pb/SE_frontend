export interface UserRegistrationData {
    firstName: string;
    lastName: string;
    login: string;
    password: string;
    age: number;
}

export interface RegistrationResponse {
    username: string;
}

export interface LoginData {
    username: string;
    password: string;
}

export interface LoginResponse {
    jwt: string;
}

