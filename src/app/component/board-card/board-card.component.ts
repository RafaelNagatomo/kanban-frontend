import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-board-card',
  imports: [],
  templateUrl: './board-card.component.html',
  styleUrl: './board-card.component.sass'
})
export class BoardCardComponent {
  @Input() title?: string = ''
  @Input() description?: string = ''
  @Input() footer?: boolean = false
  @Input() footerContent?: string = ''
}
