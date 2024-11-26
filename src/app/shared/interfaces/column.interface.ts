import { IBoard } from "./board.interface";

export interface IColumn {
  id?: number
  name?: string
  position?: number
  createdAt?: Date
  createdBy?: number
  updatedAt?: Date
  updatedBy?: number
  userId?: number
  board?: IBoard
  boardId?: number
}