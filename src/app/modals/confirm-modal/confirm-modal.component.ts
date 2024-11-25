import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core'

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.sass'
})
export class ConfirmModalComponent {
  @Input() message?: string = ''
  @Input() title?: string = ''
  @Input() isOpen: boolean = false
  @Output() emitModalClosed = new EventEmitter()
  @Output() emitConfirm = new EventEmitter()

  constructor() {}

  closeModal() {
    this.isOpen = false
    this.emitModalClosed.emit()
  }

  confirmAction() {
    this.isOpen = false
    this.emitConfirm.emit()
  }
}
