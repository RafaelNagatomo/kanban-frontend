import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IColumn } from '../../shared/interfaces/column.interface';
import { GraphqlService } from '../../shared/graphql/graphql.service';
import { GET_ALL_COLUMNS } from '../../shared/queries/column.queries';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-column',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './column.component.html',
  styleUrl: './column.component.sass',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ColumnComponent implements OnChanges {
  private columnsSubject = new BehaviorSubject<IColumn[]>([])
  columns$ = this.columnsSubject.asObservable()
  
  @Input() boardId!: number

  constructor(private graphqlService: GraphqlService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['boardId'] && changes['boardId'].currentValue) {
      this.loadAllColumnsData();
    }
    console.log(this.columns$)
  }

  private loadAllColumnsData(): void {
    this.graphqlService.query(GET_ALL_COLUMNS, { boardId: this.boardId }).subscribe({
      next: (result) => {
        const columns = result.data.getAllColumns
        this.columnsSubject.next(columns)
      },
    })
  }
}
