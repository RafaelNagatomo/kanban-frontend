export const CREATE_BOARD_MUTATION = `
  mutation CreateBoard($data: CreateBoardInput!) {
    createBoard(data: $data) {
      id
      name
      description
      userId
      createdAt
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
      createdAt
      createdBy
      updatedBy
      updatedAt
    }
  }
`

export const DELETE_BOARD_MUTATION = `
  mutation DeleteBoard($id: Int!) {
    deleteBoard(id: $id)
  }
`