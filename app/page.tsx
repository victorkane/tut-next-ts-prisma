import { getTodos } from '@/lib/todos'

export default async function Home() {
  const { todos } = await getTodos()
  return (
    <section className='py-20'>
      <div className='container'>
        <h1 className='mb-10 w-fit bg-slate-100 px-2 text-3xl font-bold text-slate-800'>
          Todos
        </h1>
        <h2 className='mt-10 border-b pb-2 text-xl font-semibold'>
          Previous todos:
        </h2>
        <ul className='mt-4 flex flex-col gap-1'>
          {todos?.map(todo => <li key={todo.id}>{todo.title}</li>)}
        </ul>
      </div>
    </section>
  )
}
