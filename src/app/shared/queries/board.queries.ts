export const GET_ALL_BOARDS = `
  query {
    getAllBoards {
      id
      name
      description
      createdAt
      createdBy
      updatedAt
      updatedBy
      userId
    }
  }
`
