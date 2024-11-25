import { Component, Output } from '@angular/core'
import { IBoard } from '../../shared/interfaces/board.interface'
import { GraphqlService } from '../../shared/graphql/graphql.service'
import { GET_ALL_BOARDS } from '../../shared/queries/board.queries'
import { BoardCardComponent } from '../../component/board-card/board-card.component'
import { CommonModule } from '@angular/common'
import { AddEditBoardComponent } from '../../modals/add-edit-board/add-edit-board.component'
import { BehaviorSubject } from 'rxjs'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BoardCardComponent, CommonModule, AddEditBoardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.sass'
})
export class HomeComponent {
  private boardsSubject = new BehaviorSubject<IBoard[]>([])
  boards$ = this.boardsSubject.asObservable()
  
  @Output() boardData: IBoard = {}
  isModalOpen: boolean = false
  isEditMode: boolean = false
  newBoard: IBoard= {}

  constructor(private graphqlService: GraphqlService) {}

  ngOnInit(): void {
    this.graphqlService.query(GET_ALL_BOARDS).subscribe({
      next: (result) => {
        const filteredBoards = result.data.getAllBoards.filter(
          (board: { userId: number }) => board.userId === 3
        )
        this.boardsSubject.next(filteredBoards)
      },
    })
  }

  openAddEditBoardModal(isEdit: boolean, board?: IBoard): void {
    this.isModalOpen = true
    this.isEditMode = isEdit
    this.boardData = board ? { ...board } : {}
  }

  onModalClosed(): void {
    this.isModalOpen = false
  }

  upsertRenderBoard(data: IBoard): void {
    const currentBoards = this.boardsSubject.value
    const boardIndex = currentBoards.findIndex(board => board.id === data.id)

    if (boardIndex !== -1) {
      const updatedBoards = currentBoards.map((board, index) => 
        index === boardIndex ? data : board
      )
      this.boardsSubject.next(updatedBoards)
    } else {
      this.boardsSubject.next([...currentBoards, data])
    }
  }
}
