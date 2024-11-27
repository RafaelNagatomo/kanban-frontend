import { IColumn } from "./column.interface"
// import { IUser } from './user.interface'

export interface IBoard {
  id?: number
  name?: string
  description?: string
  createdAt?: Date
  createdBy?: number
  updatedAt?: Date
  updatedBy?: number
  userId?: number
  columns?: IColumn[]
  // users?: IUser[]
}
  