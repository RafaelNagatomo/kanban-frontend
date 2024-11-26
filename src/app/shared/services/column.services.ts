import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { IColumn } from '../interfaces/column.interface'

@Injectable({ providedIn: 'root' })
export class ColumnService {
  private columnsSubject = new BehaviorSubject<IColumn[]>([])
  columns$ = this.columnsSubject.asObservable()

  setColumns(columns: IColumn[]): void {
    this.columnsSubject.next(columns)
  }

  upsertRenderColumn(data: IColumn): void {
    const currentColumns = this.columnsSubject.value
    const columnIndex = currentColumns.findIndex(column => column.id === data.id)

    if (columnIndex !== -1) {
      const updatedColumns = [...currentColumns]
      updatedColumns[columnIndex] = data
      this.columnsSubject.next(updatedColumns)
    } else {
      this.columnsSubject.next([...currentColumns, data])
    }
  }
}
