import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core'
import { Observable } from 'rxjs'
import { IColumn } from '../../shared/interfaces/column.interface'
import { GraphqlService } from '../../shared/graphql/graphql.service'
import { GET_ALL_COLUMNS } from '../../shared/queries/column.queries'
import { CommonModule } from '@angular/common'
import { ColumnService } from '../../shared/services/column.services'
import { ConfirmModalComponent } from '../../modals/confirm-modal/confirm-modal.component'

@Component({
  selector: 'app-column',
  standalone: true,
  imports: [CommonModule, ConfirmModalComponent],
  templateUrl: './column.component.html',
  styleUrl: './column.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnComponent implements OnChanges {
  columns$!: Observable<IColumn[]>
  isDeleteColumnModalOpen: boolean = false
  columnToDelete: IColumn = {}
  errorMessage: string = ''
  
  @Input() boardId!: number
  @Output() emitOpenAddEditColumnModal = new EventEmitter<IColumn>()

  constructor(
    private graphqlService: GraphqlService,
    private columnService: ColumnService
  ) {
    this.columns$ = this.columnService.columns$
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['boardId'] && changes['boardId'].currentValue) {
      this.loadAllColumnsData()
    }
  }

  private loadAllColumnsData(): void {
    this.graphqlService.query(GET_ALL_COLUMNS, { boardId: this.boardId }).subscribe({
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
      const result = await this.columnService.deleteColumn(this.columnToDelete)
      if (result) {
        this.onDeleteColumnModalClosed()
      }
    } catch (error) {
      console.error('Não foi possível concluir a operação:', error)
      this.errorMessage = String(error)
    }
  }
}
