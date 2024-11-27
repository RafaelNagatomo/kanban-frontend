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
      columns {
        id
        name
      }
    }
  }
`

export const GET_BOARD_BY_ID = `
  query GetBoardById($id: Int!) {
    getBoardById(id: $id) {
      id
      name
      description
      createdAt
      createdBy
      updatedAt
      updatedBy
    }
  }
`
