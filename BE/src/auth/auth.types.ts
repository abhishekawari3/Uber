export interface SignupDTO {
    name: string;
    email: string;
    password: string;
}

export interface LoginDTO {
    email: string;
    password: string;
}

export interface IUser extends Document {
  name: string
  email: string
  password: string
  role: "rider" | "driver" | "admin"
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