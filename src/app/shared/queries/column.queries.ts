export const GET_ALL_COLUMNS = `
  query GetAllColumns($boardId: Float!) {
    getAllColumns(boardId: $boardId) {
    id
    name
    position
    createdAt
    createdBy
    updatedAt
    updatedBy
    boardId
    board {
      id
      name
      createdAt
      createdBy
      updatedAt
      updatedBy
      userId
    }
  }
}
`