export const CREATE_COLUMN_MUTATION = `
  mutation CreateColumn($data: CreateColumnInput!) {
    createColumn(data: $data) {
      id
      name
      position
      createdBy
      boardId
    }
  }
`

export const UPDATE_COLUMN_MUTATION = `
  mutation UpdateColumn($id: Int!, $data: UpdateColumnInput!) {
    updateColumn(id: $id, data: $data) {
      id
      name
      position
      updatedBy
      updatedAt
      boardId
    }
  }
`

export const DELETE_COLUMN_MUTATION = `
  mutation DeleteColumn($id: Int!) {
    deleteColumn(id: $id)
  }
`