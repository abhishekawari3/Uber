export interface SignupDTO {
    name: string;
    email: string;
    password: string;
}

export interface LoginDTO {
    email: string;
    password: string;
}

export interface UserType  {
    _id: string;
    name: string;
    email: string;
    password: string;
    role: string;
}

export interface payloadType {
    _id : string;
    name: string;
    role: string;
}

export interface SignupResult {
    user: {
        _id: string;
    };
}

export interface LoginResult {
    token: string;
}