import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { IColumn } from '../../shared/interfaces/column.interface'
import { GraphqlService } from '../../shared/graphql/graphql.service'
import { GET_ALL_COLUMNS } from '../../shared/queries/column.queries'
import { CommonModule } from '@angular/common'
import { ColumnService } from '../../shared/services/column.services'
import { ConfirmModalComponent } from '../../modals/confirm-modal/confirm-modal.component'
import { CardComponent } from '../card/card.component'
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop'

@Component({
  selector: 'app-column',
  standalone: true,
  imports: [
    CommonModule,
    ConfirmModalComponent,
    CardComponent,
    DragDropModule
  ],
  templateUrl: './column.component.html',
  styleUrl: './column.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnComponent implements OnChanges {
  private columnsSubject = new BehaviorSubject<IColumn[]>([])
  columns$: Observable<IColumn[]> = this.columnsSubject.asObservable()

  isDeleteColumnModalOpen: boolean = false
  columnToDelete: IColumn = {}
  errorMessage: string = ''
  
  @Input() boardId!: number
  @Output() emitOpenAddEditColumnModal = new EventEmitter<IColumn>()

  constructor(
    private graphqlService: GraphqlService,
    private columnService: ColumnService
  ) {
    this.columnService.columns$.subscribe(columns => {
      this.columnsSubject.next(columns)
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['boardId'] && changes['boardId'].currentValue) {
      this.loadAllColumnsData()
    }
  }

  private loadAllColumnsData(): void {
    this.graphqlService.query(GET_ALL_COLUMNS, { boardId: this.boardId })
    .subscribe({
      next: (result) => {
        const columns = result.data.getAllColumns
        this.columnService.setColumns(columns)
      },
    })
  }

  openDeleteModal(column: IColumn): void {
    this.columnToDelete = column
    this.isDeleteColumnModalOpen = true
  }

  openAddEditColumnModal(columnData?: IColumn) {
    this.emitOpenAddEditColumnModal.emit(columnData)
  }

  onDeleteColumnModalClosed(): void {
    this.isDeleteColumnModalOpen = false
  }

  async handleDeletionColumn(): Promise<void> {
    if (!this.columnToDelete) return
    try {
      const result = await this.columnService.deleteColumn(
        this.columnToDelete
      )
      if (result) {
        this.onDeleteColumnModalClosed()
      }
    } catch (error) {
      console.error('Não foi possível concluir a operação:', error)
      this.errorMessage = String(error)
    }
  }

  moveColumnList(fromIndex: number, toIndex: number): void {
    const currentColumns = this.columnsSubject.getValue()
    moveItemInArray(currentColumns, fromIndex, toIndex)
    this.columnsSubject.next(currentColumns);
  }

  moveList(dropEvent: CdkDragDrop<IColumn[]>): void {
    const { previousIndex, currentIndex } = dropEvent
    if (previousIndex === currentIndex) {
      return
    }
    this.moveColumnList(previousIndex, currentIndex)
  }
}
