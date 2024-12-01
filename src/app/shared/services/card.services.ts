import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { GraphqlService } from '../graphql/graphql.service'
import { ICard } from '../interfaces/card.interface'
import {
  CREATE_CARD_MUTATION,
  DELETE_CARD_MUTATION,
  UPDATE_CARD_MUTATION,
  UPDATE_CARDS_POSITIONS
} from '../commands/card.commands'

@Injectable({ providedIn: 'root' })
export class CardService {
  private cardsSubject = new BehaviorSubject<Map<number, BehaviorSubject<ICard[]>>>(new Map())
  cards$ = this.cardsSubject.asObservable()

  constructor(private graphqlService: GraphqlService) {}

  getCardsByColumn(columnId: number): Observable<ICard[]> {
    const currentMap = this.cardsSubject.value
    if (!currentMap.has(columnId)) {
      const emptySubject = new BehaviorSubject<ICard[]>([])
      const updatedMap = new Map(currentMap)

      updatedMap.set(columnId, emptySubject)
      this.cardsSubject.next(updatedMap)
      return emptySubject.asObservable()
    }
    return currentMap.get(columnId)!.asObservable()
  }

  setCardsForColumn(columnId: number, cards: ICard[]): void {
    const currentMap = this.cardsSubject.value
    const updatedMap = new Map(currentMap)

    if (!updatedMap.has(columnId)) {
      updatedMap.set(columnId, new BehaviorSubject<ICard[]>(cards))
    } else {
      updatedMap.get(columnId)!.next(cards)
    }
    this.cardsSubject.next(updatedMap)
  }

  createCard(cardData: Partial<ICard>, columnId: number): Promise<ICard | null> {
    return new Promise((resolve, reject) => {
      this.graphqlService
      .mutate(CREATE_CARD_MUTATION, { data: cardData })
      .subscribe({
        next: ({ data }) => {
          const createdCard = data?.createCard || null

          if (createdCard) {
            const currentCardsMap = this.cardsSubject.getValue()
            const columnCardsSubject = currentCardsMap.get(columnId)

            if (columnCardsSubject) {
              const currentCards = columnCardsSubject.value
              columnCardsSubject.next([...currentCards, createdCard])
            }

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
              const currentCardsMap = this.cardsSubject.getValue()
              const columnCardsSubject = currentCardsMap.get(columnId)

              if (columnCardsSubject) {
                const currentCard = columnCardsSubject.value
                const updatedCards = currentCard.map(card =>
                  card.id === updatedCard.id ? updatedCard : card
                )
                columnCardsSubject.next(updatedCards)
              }
              
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

  updateColumnPosition(cardsWithNewPositions: Partial<ICard[]>): Promise<ICard | null> {
    return new Promise((resolve, reject) => {
      this.graphqlService.mutate(UPDATE_CARDS_POSITIONS, { cards: cardsWithNewPositions })
      .subscribe({
        next: ({ data }) => {
          if(data) {
            const updatedCard = data?.updateCard
            resolve(updatedCard)
          }
        },
        error: (error) => {
          console.error('Erro ao atualizar posições dos cards:', error)
          reject(error)
        }
      })
    })
  }

  deleteCard(deleteCardData: Partial<ICard>, columnId: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.graphqlService
        .mutate(DELETE_CARD_MUTATION, { id: deleteCardData.id })
        .subscribe({
          next: ({data}) => {
            const deletedCard = data?.deleteCard || null
            
            if (deletedCard) {
              const currentCardsMap = this.cardsSubject.getValue()
              const columnCardsSubject = currentCardsMap.get(columnId)
            
              if (columnCardsSubject) {
                const updatedCards = columnCardsSubject.getValue().filter(
                  (card) => card.id !== deleteCardData.id
                )
                columnCardsSubject.next(updatedCards);
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
