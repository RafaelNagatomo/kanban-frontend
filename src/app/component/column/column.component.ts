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

@Component({
  selector: 'app-column',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './column.component.html',
  styleUrl: './column.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnComponent implements OnChanges {
  columns$!: Observable<IColumn[]>
  
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

  openAddEditColumnModal(columnData?: IColumn) {
    this.emitOpenAddEditColumnModal.emit(columnData)
  }
}
