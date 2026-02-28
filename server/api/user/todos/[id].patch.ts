import { prisma } from '~~/server/utils/db'
import { z } from 'zod'

/**
 * 更新 todo（标记完成、修改标题等）
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
      message: '无权修改此 Todo',
    })
  }

  try {
    const body = await readBody(event)

    const schema = z.object({
      title: z.string().optional(),
      completed: z.boolean().optional(),
      dueDate: z.string().nullable().optional(),
    })

    const parsed = schema.parse(body)

    const updatedTodo = await prisma.todo.update({
      where: { id: todoIdNum },
      data: parsed,
      select: {
        id: true,
        title: true,
        completed: true,
        createdAt: true,
        updatedAt: true,
        dueDate: true,
      },
    })

    return updatedTodo
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors?.[0]?.message || '验证失败'
      throw createError({
        statusCode: 400,
        message: firstError,
      })
    }
    throw error
  }
})
