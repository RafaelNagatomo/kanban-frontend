import { ChangeDetectionStrategy, Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { Observable } from 'rxjs'
import { ConfirmModalComponent } from '../../modals/confirm-modal/confirm-modal.component'
import { ICard } from '../../shared/interfaces/card.interface'
import { GraphqlService } from '../../shared/graphql/graphql.service'
import { GET_ALL_CARDS } from '../../shared/queries/card.queries'
import { CardService } from '../../shared/services/card.services'
import { AddEditCardComponent } from '../../modals/add-edit-card/add-edit-card.component'

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    CommonModule,
    ConfirmModalComponent,
    AddEditCardComponent
  ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent implements OnChanges {
  cards$!: Observable<ICard[]>
  isDeleteCardModalOpen: boolean = false
  isAddEditCardModalOpen: boolean = false
  isEditMode: boolean = false
  cardToDelete: ICard = {}
  cardData: ICard = {}
  errorMessage: string = ''
  
  @Input() columnId!: number
  @Output() emitOpenAddEditCardModal = new EventEmitter<ICard>()

  constructor(
    private graphqlService: GraphqlService,
    private cardService: CardService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['columnId'] && changes['columnId'].currentValue) {
      this.loadAllCardsData()
    }
  }

  private loadAllCardsData(): void {
    this.graphqlService.query(GET_ALL_CARDS, { columnId: this.columnId })
    .subscribe({
      next: ({data}) => {
        const cards = data?.getAllCards
        this.cardService.setCardsForColumn(this.columnId!, cards)
      },
    })
    this.cards$ = this.cardService.getCardsByColumn(this.columnId!)
  }

  openAddEditCardModal(card?: ICard): void {
    this.isAddEditCardModalOpen = true
    this.isEditMode = card ? true : false
    this.cardData = card ? { ...card } : {}
    console.log('openAddEditCardModal: ', card)
  }

  onCardModalClosed() {
    this.isAddEditCardModalOpen = false
  }

  openDeleteModal(card: ICard): void {
    this.cardToDelete = card
    this.isDeleteCardModalOpen = true
  }

  onDeleteCardModalClosed(): void {
    this.isDeleteCardModalOpen = false
  }

  async handleDeletionColumn() {
    if (!this.cardToDelete) return
    try {
      const result = await this.cardService.deleteCard(this.cardToDelete, this.columnId!)
      if (result) {
        this.onDeleteCardModalClosed()
      }
    } catch (error) {
      console.error('Não foi possível concluir a operação:', error)
      this.errorMessage = String(error)
    }
  }
}
