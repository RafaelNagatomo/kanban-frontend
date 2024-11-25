import { Component, EventEmitter, Input, Output } from '@angular/core'
import { IBoard } from '../../shared/interfaces/board.interface'

@Component({
  selector: 'app-board-card',
  imports: [],
  templateUrl: './board-card.component.html',
  styleUrl: './board-card.component.sass'
})
export class BoardCardComponent {
  @Input() name?: string = ''
  @Input() description?: string = ''
  @Input() footer?: boolean = false
  @Input() footerContent?: string[] = []
  @Output() emitOpenAddEditBoardModal = new EventEmitter<IBoard>();
  @Output() emitOpenDeleteBoardModal = new EventEmitter<IBoard>();
  boardData: IBoard = {}

  openAddEditBoardModal(boardData: IBoard) {
    this.emitOpenAddEditBoardModal.emit(boardData);
  }

  openDeleteBoardModal(boardData: IBoard) {
    this.emitOpenDeleteBoardModal.emit(boardData)
  }
}
