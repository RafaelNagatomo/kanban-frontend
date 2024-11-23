import { Component } from '@angular/core'
import { IBoard } from '../../shared/interfaces/board.interface'
import { GraphqlService } from '../../shared/graphql/graphql.service'
import { GET_ALL_BOARDS } from '../../shared/queries/board.queries'
import { BoardCardComponent } from '../../component/board-card/board-card.component'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BoardCardComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.sass'
})
export class HomeComponent {
  boards: IBoard[] = []

  constructor(private graphqlService: GraphqlService) {}

  ngOnInit(): void {
    this.graphqlService.query(GET_ALL_BOARDS).subscribe({
      next: (result) => {
        this.boards = result.data.getAllBoards
        .filter((board: { userId: number; }) => board.userId === 3)
      },
    })
  }
}
