export const GET_ALL_CARDS = `
  query GetAllCards($columnId: Float!) {
    getAllCards(columnId: $columnId) {
      id
      name
      description
      position
      createdAt
      createdBy
      updatedAt
      updatedBy
      columnId
    }
  }
`