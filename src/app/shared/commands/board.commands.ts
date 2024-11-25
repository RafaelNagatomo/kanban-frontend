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

export const UPDATE_BOARD_MUTATION = `
  mutation UpdateBoard($id: Int!, $data: UpdateBoardInput!) {
    updateBoard(id: $id, data: $data) {
      id
      name
      description
      updatedBy
      updatedAt
    }
  }
`