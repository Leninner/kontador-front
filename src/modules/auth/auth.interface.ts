export interface IUser {
  id: string
  email: string
  name: string
  createdAt: Date
  updatedAt: Date
  phone: string
  phoneVerified?: boolean
  licenseNumber?: string
  taxIdentificationNumber?: string
  specialization?: string
  languages?: string
  yearsOfExperience?: number
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

export interface IRegisterDto {
  email: string
  password: string
  name: string
}

export interface IVerifyPhoneDto {
  countryCode: string
  phoneNumber: string
}
