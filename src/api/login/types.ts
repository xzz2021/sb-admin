export interface UserLoginType {
  username: string
  password: string
}

export interface UserType {
  username: string
  password: string
  role: string
  roleId: string
  nickname: string
  code?: string
  sqlMessage?: string
}

export interface UserRegisterType {
  username: string
  password: string
  check_password: string
  code: string
}
