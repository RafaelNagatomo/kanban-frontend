import { IColumn } from "./column.interface"

export interface ICard {
  id?: number
  name?: string
  description?: string
  position?: number
  createdAt?: Date
  createdBy?: number
  updatedAt?: Date
  updatedBy?: number
  column?: IColumn
  columnId?: number
}