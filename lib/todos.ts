import prisma from './prisma'

export async function getTodos() {
  try {
    const todos = await prisma.todo.findMany()
    return { todos }
  } catch (error) {
    return { error }
  }
}
