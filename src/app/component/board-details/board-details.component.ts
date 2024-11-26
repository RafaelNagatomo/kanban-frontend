import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { IBoard } from '../../shared/interfaces/board.interface'
import { GET_BOARD_BY_ID } from '../../shared/queries/board.queries';
import { GraphqlService } from '../../shared/graphql/graphql.service';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ColumnComponent } from '../column/column.component';

@Component({
  selector: 'app-board-details',
  standalone: true,
  imports: [CommonModule, ColumnComponent],
  templateUrl: './board-details.component.html',
  styleUrl: './board-details.component.sass'
})
export class BoardDetailsComponent implements OnInit {
  private boardsSubject = new BehaviorSubject<IBoard>({})
  board$ = this.boardsSubject.asObservable()

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
}
