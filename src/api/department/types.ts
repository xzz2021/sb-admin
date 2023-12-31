export interface DepartmentItem {
  id: string
  departmentName: string
  children?: DepartmentItem[]
}

export interface DepartmentListResponse {
  list: DepartmentItem[]
}

// export interface xzzDepartmentListResponse {
//   data: any[]
// }

export interface DepartmentUserParams {
  pageSize: number
  pageIndex: number
  id: string
  username?: string
  password?: string
  nickname?: string
  role?: any
  createtime?: any
}

// export interface DepartmentUserItem {
//   id: string
//   username: string
//   account: string
//   email: string
//   createTime: string
//   role: string
//   department: DepartmentItem
// }

export interface DepartmentUserItem {
  id: string
  username: string
  account: string
  email: string
  createTime: string
  role: any
  department: any
  password: string
}

export interface DepartmentUserResponse {
  list: DepartmentUserItem[]
  total: number
}

export interface DepartmentUserResponseXzz {
  list?: DepartmentUserItem[] | any
  data?: DepartmentUserItem[]
  length: number
}
