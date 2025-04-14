export interface IUser {
  id: string
  email: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export interface IAuthResponse {
  success: boolean
  data?: {
    user: IUser
    token: string
  }
  error?: {
    message: string
    code: string
  }
}

export interface ILoginDto {
  email: string
  password: string
}

export interface IRegisterDto extends ILoginDto {
  name: string
}
