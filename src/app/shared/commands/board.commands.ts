export const CREATE_BOARD_MUTATION = `
  mutation CreateBoard($data: CreateBoardInput!) {
    createBoard(data: $data) {
      id
      name
      description
      userId
      createdBy
    }
  }
`