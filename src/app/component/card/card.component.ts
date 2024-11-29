import { ChangeDetectionStrategy, Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ConfirmModalComponent } from '../../modals/confirm-modal/confirm-modal.component';
import { ICard } from '../../shared/interfaces/card.interface';
import { GraphqlService } from '../../shared/graphql/graphql.service';
import { GET_ALL_CARDS } from '../../shared/queries/card.queries';
import { CardService } from '../../shared/services/card.services';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, ConfirmModalComponent],
  templateUrl: './card.component.html',
  styleUrl: './card.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent implements OnChanges {
  cards$!: Observable<ICard[]>
  isDeleteCardModalOpen: boolean = false
  cardToDelete: ICard = {}
  errorMessage: string = ''
  
  @Input() columnId?: number
  @Output() emitOpenAddEditCardModal = new EventEmitter<ICard>()

  constructor(
    private graphqlService: GraphqlService,
    private cardService: CardService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['columnId'] && changes['columnId'].currentValue) {
      this.loadAllCardsData();
    }
  }

  private loadAllCardsData(): void {
    this.graphqlService.query(GET_ALL_CARDS, { columnId: this.columnId }).subscribe({
      next: ({data}) => {
        const cards = data?.getAllCards
        this.cardService.setCardsForColumn(this.columnId!, cards)
      },
    })
    this.cards$ = this.cardService.getCardsByColumn(this.columnId!)
  }

  openAddEditColumnModal(cardData?: ICard) {
    this.emitOpenAddEditCardModal.emit(cardData)
  }

  handleDeletionColumn() {
  }

  onDeleteColumnModalClosed() {
  }

}
