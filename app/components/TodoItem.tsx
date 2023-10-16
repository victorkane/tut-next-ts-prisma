import { Todo } from '@prisma/client'

type TodoItemProps = {
  todo: Todo
}

const TodoItem = ({ todo }: TodoItemProps) => {
  return <li>{todo.title}</li>
}

export default TodoItem
