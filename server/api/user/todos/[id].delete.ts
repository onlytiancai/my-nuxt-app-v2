import { prisma } from '~~/server/utils/db'

/**
 * 删除 todo
 */
export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  if (!user?.id) {
    throw createError({
      statusCode: 401,
      message: '未登录',
    })
  }

  const todoId = getRouterParam(event, 'id')

  if (!todoId || isNaN(Number(todoId))) {
    throw createError({
      statusCode: 400,
      message: '无效的 Todo ID',
    })
  }

  const todoIdNum = Number(todoId)

  // 检查 todo 是否存在且属于当前用户
  const existingTodo = await prisma.todo.findUnique({
    where: { id: todoIdNum },
  })

  if (!existingTodo) {
    throw createError({
      statusCode: 404,
      message: 'Todo 不存在',
    })
  }

  if (existingTodo.userId !== user.id) {
    throw createError({
      statusCode: 403,
      message: '无权删除此 Todo',
    })
  }

  await prisma.todo.delete({
    where: { id: todoIdNum },
  })

  return { success: true, message: 'Todo 已删除' }
})
