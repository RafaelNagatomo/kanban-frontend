import { Component } from '@angular/core'
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
  
  isModalOpen: boolean = false
  isEditMode: boolean = false
  boardData: IBoard = {}
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
    this.boardData = { ...board }
  }

  onModalClosed(): void {
    this.isModalOpen = false;
  }

  newBoardAdd(newBoard: IBoard): void {
    const currentBoards = this.boardsSubject.value
    this.boardsSubject.next([...currentBoards, newBoard])
  }
}
