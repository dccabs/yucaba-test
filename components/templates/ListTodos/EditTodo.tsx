import React from 'react'

type PropsType = {
  isEditingTodo: boolean
  onCancel: () => void
  onEdit: () => void
}

const EditTodo = ({ onEdit, onCancel, isEditingTodo }: PropsType) => {
  return (
    <>
      {!isEditingTodo ? (
        <button
          className="text-sm ml-4 font-medium text-blue-500"
          onClick={onEdit}>
          Edit
        </button>
      ) : (
        <button
          className="text-sm ml-4 font-medium text-blue-500"
          onClick={onCancel}>
          Cancel
        </button>
      )}
    </>
  )
}

export default EditTodo
