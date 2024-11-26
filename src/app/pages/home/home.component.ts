import { Component, Output } from '@angular/core'
import { IBoard } from '../../shared/interfaces/board.interface'
import { GraphqlService } from '../../shared/graphql/graphql.service'
import { GET_ALL_BOARDS } from '../../shared/queries/board.queries'
import { BoardCardComponent } from '../../component/board-card/board-card.component'
import { CommonModule } from '@angular/common'
import { AddEditBoardComponent } from '../../modals/add-edit-board/add-edit-board.component'
import { BehaviorSubject } from 'rxjs'
import { ConfirmModalComponent } from "../../modals/confirm-modal/confirm-modal.component";
import { DELETE_BOARD_MUTATION } from '../../shared/commands/board.commands'
import { Router } from '@angular/router'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    BoardCardComponent,
    CommonModule,
    AddEditBoardComponent,
    ConfirmModalComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.sass'
})
export class HomeComponent {
  private boardsSubject = new BehaviorSubject<IBoard[]>([])
  boards$ = this.boardsSubject.asObservable()
  
  @Output() boardData: IBoard = {}
  isAddEditBoardModalOpen: boolean = false
  isDeleteBoardModalOpen: boolean = false
  isEditMode: boolean = false
  boardToDelete: IBoard = {}

  constructor(private graphqlService: GraphqlService, private router: Router) {}

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
    this.isAddEditBoardModalOpen = true
    this.isEditMode = isEdit
    this.boardData = board ? { ...board } : {}
  }

  onBoardModalClosed(): void {
    this.isAddEditBoardModalOpen = false
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

  openDeleteModal(board: IBoard): void {
    this.boardToDelete = board
    this.isDeleteBoardModalOpen = true
  }

  onDeleteBoardModalClosed(): void {
    this.isDeleteBoardModalOpen = false
  }

  handleDeletionBoard(): void {
    if (!this.boardToDelete) return

    this.graphqlService.mutate(DELETE_BOARD_MUTATION, { id: this.boardToDelete.id }).subscribe({
      next: (result) => {
        if (result) {
          const currentBoards = this.boardsSubject.value
          const updatedBoards = currentBoards
            .filter(
              board => board.id !== this.boardToDelete.id
            )
          this.boardsSubject.next([...updatedBoards])
        } else {
          console.error('Falha ao deletar a coluna');
        }
      },
    })
    this.onDeleteBoardModalClosed()
  }

  openBoard(board?: IBoard): void {
    if (!board) return
    this.router.navigate(['/board', board.id])
  }
}
