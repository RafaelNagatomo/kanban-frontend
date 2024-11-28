import { Component, OnInit, Output } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { IBoard } from '../../shared/interfaces/board.interface'
import { GET_BOARD_BY_ID } from '../../shared/queries/board.queries'
import { GraphqlService } from '../../shared/graphql/graphql.service'
import { BehaviorSubject } from 'rxjs'
import { CommonModule } from '@angular/common'
import { ColumnComponent } from '../column/column.component'
import { AddEditColumnComponent } from '../../modals/add-edit-column/add-edit-column.component'
import { IColumn } from '../../shared/interfaces/column.interface'

@Component({
  selector: 'app-board-details',
  standalone: true,
  imports: [
    CommonModule,
    ColumnComponent,
    AddEditColumnComponent
  ],
  templateUrl: './board-details.component.html',
  styleUrl: './board-details.component.sass'
})
export class BoardDetailsComponent implements OnInit {
  private boardsSubject = new BehaviorSubject<IBoard>({})
  board$ = this.boardsSubject.asObservable()

  private columnsSubject = new BehaviorSubject<IColumn[]>([])
  column$ = this.columnsSubject.asObservable()

  @Output() columnData: IColumn = {}
  isAddEditColumnModalOpen: boolean = false
  isEditMode: boolean = false

  constructor(private graphqlService: GraphqlService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const boardId = +this.route.snapshot.params['id']!
    if (boardId) {
      this.loadBoardDataById(boardId)
    }
  }

  private loadBoardDataById(boardId: number): void {
    this.graphqlService.query(GET_BOARD_BY_ID, { id: boardId }).subscribe({
      next: (result) => {
        const board = result.data.getBoardById
        this.boardsSubject.next(board)
      },
    })
  }

  openAddEditColumnModal(column?: IColumn): void {
    this.isAddEditColumnModalOpen = true
    this.isEditMode = column ? true : false
    this.columnData = column ? { ...column } : {}
  }

  onColumnModalClosed(): void {
    this.isAddEditColumnModalOpen = false
  }
}
