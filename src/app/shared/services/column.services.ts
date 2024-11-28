import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { IColumn } from '../interfaces/column.interface'
import { GraphqlService } from '../graphql/graphql.service'
import {
  CREATE_COLUMN_MUTATION,
  UPDATE_COLUMN_MUTATION,
  DELETE_COLUMN_MUTATION
} from '../commands/column.commands'

@Injectable({ providedIn: 'root' })
export class ColumnService {
  private columnsSubject = new BehaviorSubject<IColumn[]>([])
  columns$ = this.columnsSubject.asObservable()

  constructor(private graphqlService: GraphqlService) {}

  setColumns(columns: IColumn[]): void {
    this.columnsSubject.next(columns)
  }

  createColumn(columnData: Partial<IColumn>): Promise<IColumn | null> {
    return new Promise((resolve, reject) => {
      this.graphqlService
      .mutate(CREATE_COLUMN_MUTATION, { data: columnData })
      .subscribe({
        next: ({ data }) => {
          const createdColumn = data?.createColumn || null

          if (createdColumn) {
            const currentColumns = this.columnsSubject.value
            this.columnsSubject.next([...currentColumns, createdColumn])
            resolve(createdColumn)
          } else {
            console.error('Falha ao criar coluna')
            resolve(null)
          }
        },
        error: (error: any) => {
          console.error('Erro ao criar coluna:', error)
          reject(error)
        },
      })
    })
  }

  updateColumn(updateColumnData: Partial<IColumn>): Promise<IColumn | null> {
    return new Promise((resolve, reject) => {
      this.graphqlService
        .mutate(UPDATE_COLUMN_MUTATION, { id: updateColumnData.id, data: updateColumnData })
        .subscribe({
          next: ({ data }) => {
            const updatedColumn = data?.updateColumn
  
            if (updatedColumn) {
              const currentColumns = this.columnsSubject.value
              const updatedColumns = currentColumns.map(column =>
                column.id === updatedColumn.id ? updatedColumn : column)
              this.columnsSubject.next(updatedColumns)
              resolve(updatedColumn)
            } else {
              console.error('Falha ao atualizar coluna')
              return resolve(null)
            }
          },
          error: (error) => {
            console.error('Erro ao atualizar coluna:', error)
            reject(error)
          },
        })
    })
  }

  deleteColumn(deleteColumnData: Partial<IColumn>): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.graphqlService
        .mutate(DELETE_COLUMN_MUTATION, { id: deleteColumnData.id })
        .subscribe({
          next: ({data}) => {
            const deletedColum = data?.deleteColumn
            
            if (deletedColum) {
              const currentColumns = this.columnsSubject.value
              const updatedColumns = currentColumns.filter(column =>
                column.id !== deleteColumnData.id)
              this.columnsSubject.next(updatedColumns)
              resolve(true)
            } else {
              console.error('Falha ao deletar a coluna')
              return resolve(false)
            }
          },
          error: (error) => {
            console.error('Erro ao atualizar coluna:', error)
            reject(error)
          },
        })
    })
  }
}
