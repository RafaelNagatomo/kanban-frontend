export const CREATE_CARD_MUTATION = `
  mutation CreateCard($data: CreateCardInput!) {
    createCard(data: $data) {
      id
      name
      position
      createdBy
      columnId
    }
  }
`

export const UPDATE_CARD_MUTATION = `
  mutation UpdateCard($id: Int!, $data: UpdateCardInput!) {
    updateCard(id: $id, data: $data) {
      id
      name
      position
      updatedBy
      updatedAt
      columnId
    }
  }
`

export const DELETE_CARD_MUTATION = `
  mutation DeleteCard($id: Int!) {
    deleteCard(id: $id)
  }
`