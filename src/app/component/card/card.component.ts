import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { BehaviorSubject, Observable } from 'rxjs'
import { ConfirmModalComponent } from '../../modals/confirm-modal/confirm-modal.component'
import { ICard } from '../../shared/interfaces/card.interface'
import { GraphqlService } from '../../shared/graphql/graphql.service'
import { GET_ALL_CARDS } from '../../shared/queries/card.queries'
import { CardService } from '../../shared/services/card.services'
import { AddEditCardComponent } from '../../modals/add-edit-card/add-edit-card.component'
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop'

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    CommonModule,
    ConfirmModalComponent,
    AddEditCardComponent,
    DragDropModule
  ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent implements OnChanges {
  private cardsSubject = new BehaviorSubject<ICard[]>([])
  cards$: Observable<ICard[]> = this.cardsSubject.asObservable()

  isDeleteCardModalOpen: boolean = false
  isAddEditCardModalOpen: boolean = false
  isEditMode: boolean = false
  cardToDelete: ICard = {}
  cardData: ICard = {}
  errorMessage: string = ''
  
  @Input() columnId?: number
  @Output() emitOpenAddEditCardModal = new EventEmitter<ICard>()

  constructor(
    private graphqlService: GraphqlService,
    private cardService: CardService
  ) {
    this.cardService.cards$.subscribe((cardsMap: Map<number, BehaviorSubject<ICard[]>>) => {
      const allCards: ICard[] = [];
      cardsMap.forEach((subject) => {
        allCards.push(...(subject.value ?? []))
      })
      this.cardsSubject.next(allCards)
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['columnId'] && changes['columnId'].currentValue) {
      this.loadAllCardsData()
    }
  }

  private loadAllCardsData(): void {
    if (!this.columnId) return

    this.graphqlService.query(GET_ALL_CARDS, { columnId: this.columnId! })
    .subscribe({
      next: ({data}) => {
        const cards = data?.getAllCards ?? []
        this.cardService.setCardsForColumn(this.columnId!, cards)
      },
    })
    this.cards$ = this.cardService.getCardsByColumn(this.columnId!)
  }

  openAddEditCardModal(card?: ICard): void {
    this.isAddEditCardModalOpen = true
    this.isEditMode = card ? true : false
    this.cardData = card ? { ...card } : {}
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
      const result = await this.cardService.deleteCard(
        this.cardToDelete,
        this.columnId!
      )
      if (result) {
        this.onDeleteCardModalClosed()
      }
    } catch (error) {
      console.error('Não foi possível concluir a operação:', error)
      this.errorMessage = String(error)
    }
  }

  reorderTask(list: ICard[], fromIndex: number, toIndex: number): void {
    moveItemInArray(list, fromIndex, toIndex)
    const reorderedCards = list.map((card, index) => ({
      id: card.id,
      updatedBy: 3,
      position: index,
    }))
    this.cardsSubject.next(reorderedCards)
    this.updateCardPosition(reorderedCards)
  }
  
  transferTask(
    previousList: ICard[],
    currentList: ICard[],
    fromIndex: number,
    toIndex: number
  ): void {
    transferArrayItem(previousList, currentList, fromIndex, toIndex)
    const currentColumnId = this.columnId
    const updatedPreviousList = previousList.map((card, index) => ({
      id: card.id,
      updatedBy: 3,
      position: index,
    }))
    const updatedCurrentList = currentList.map((card, index) => ({
      id: card.id,
      updatedBy: 3,
      position: index,
      columnId: currentColumnId,
    }))
    this.cardsSubject.next([...updatedPreviousList, ...updatedCurrentList])
    this.updateCardPosition([...updatedPreviousList, ...updatedCurrentList])
  }
  
  
  
  moveTask(dropEvent: CdkDragDrop<ICard[] | null>): void {
    const { previousContainer, container, previousIndex, currentIndex } = dropEvent
    const isSameContainer = previousContainer === container
    const previousData = previousContainer.data || []
    const currentData = container.data || []
    if (isSameContainer && previousIndex === currentIndex) return
    if (isSameContainer) {
      this.reorderTask(currentData, previousIndex, currentIndex)
    } else {
      this.transferTask(previousData, currentData, previousIndex, currentIndex)
    }
  }

  async updateCardPosition(movedCard: ICard[]) {
    try {
      await this.cardService.updateColumnPosition(movedCard)
    } catch (error) {
      console.error('Não foi possível concluir a operação:', error)
      this.errorMessage = String(error)
    }
  }
}
