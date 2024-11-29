import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { GraphqlService } from '../graphql/graphql.service'
import { ICard } from '../interfaces/card.interface'
import {
  CREATE_CARD_MUTATION,
  DELETE_CARD_MUTATION,
  UPDATE_CARD_MUTATION
} from '../commands/card.commands'

@Injectable({ providedIn: 'root' })
export class CardService {
  private cardsSubject = new Map<number, BehaviorSubject<ICard[]>>([])

  constructor(private graphqlService: GraphqlService) {}

  getCardsByColumn(columnId: number): Observable<ICard[]> {
    if (!this.cardsSubject.has(columnId)) {
      this.cardsSubject.set(columnId, new BehaviorSubject<ICard[]>([]))
    }
    return this.cardsSubject.get(columnId)!.asObservable()
  }

  setCardsForColumn(columnId: number, cards: ICard[]): void {
    console.log(`Updating cards for column ${columnId}:`, cards)
    if (!this.cardsSubject.has(columnId)) {
      this.cardsSubject.set(columnId, new BehaviorSubject<ICard[]>([]))
    }
    this.cardsSubject.get(columnId)!.next(cards)
  }

  createCard(cardData: Partial<ICard>, columnId: number): Promise<ICard | null> {
    console.log(cardData)
    return new Promise((resolve, reject) => {
      this.graphqlService
      .mutate(CREATE_CARD_MUTATION, { data: cardData })
      .subscribe({
        next: ({ data }) => {
          const createdCard = data?.createCard || null

          if (createdCard) {
            let columnCardsSubject = this.cardsSubject.get(columnId)

            if (!columnCardsSubject) {
              columnCardsSubject = new BehaviorSubject<ICard[]>([])
              this.cardsSubject.set(columnId, columnCardsSubject)
            }
              const currentCards = columnCardsSubject.value
              columnCardsSubject.next([...currentCards, createdCard])

              resolve(createdCard)
          } else {
            console.error('Falha ao criar card')
            resolve(null)
          }
        },
        error: (error: any) => {
          console.error('Erro ao criar card:', error)
          reject(error)
        },
      })
    })
  }

  updateCard(updateCardData: Partial<ICard>, columnId: number): Promise<ICard | null> {
    return new Promise((resolve, reject) => {
      this.graphqlService
        .mutate(UPDATE_CARD_MUTATION, { id: updateCardData.id, data: updateCardData })
        .subscribe({
          next: ({ data }) => {
            const updatedCard = data?.updateCard || null
  
            if (updatedCard) {
              let columnCardsSubject = this.cardsSubject.get(columnId)

              if (!columnCardsSubject) {
                columnCardsSubject = new BehaviorSubject<ICard[]>([])
                this.cardsSubject.set(columnId, columnCardsSubject)
              }

              const currentCard = columnCardsSubject.value
              const updatedCards = currentCard.map(card =>
                card.id === updatedCard.id ? updatedCard : card
              )
              columnCardsSubject.next(updatedCards)
              
              resolve(updatedCard)
            } else {
              console.error('Falha ao atualizar card')
              return resolve(null)
            }
          },
          error: (error) => {
            console.error('Erro ao atualizar card:', error)
            reject(error)
          },
        })
    })
  }

  deleteCard(deleteCardData: Partial<ICard>, columnId: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.graphqlService
        .mutate(DELETE_CARD_MUTATION, { id: deleteCardData.id })
        .subscribe({
          next: ({data}) => {
            const deletedCard = data?.deleteCard
            
            if (deletedCard) {
              const columnCardsSubject = this.cardsSubject.get(columnId)

              if (columnCardsSubject) {
                const currentCards = columnCardsSubject.value
                const updatedCards = currentCards.filter(card =>
                  card.id !== deleteCardData.id
                )
                columnCardsSubject.next(updatedCards)
              }

              resolve(true)
            } else {
              console.error('Falha ao deletar a card')
              return resolve(false)
            }
          },
          error: (error) => {
            console.error('Erro ao atualizar card:', error)
            reject(error)
          },
        })
    })
  }
}
