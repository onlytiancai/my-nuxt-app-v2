import { prisma } from '~~/server/utils/db'
import { z } from 'zod'

/**
 * 创建新的 todo
 */
export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  if (!user?.id) {
    throw createError({
      statusCode: 401,
      message: '未登录',
    })
  }

  try {
    const body = await readBody(event)

    const schema = z.object({
      title: z.string().min(1, '标题不能为空'),
      dueDate: z.string().optional(),
    })

    const parsed = schema.parse(body)

    const todo = await prisma.todo.create({
      data: {
        title: parsed.title,
        dueDate: parsed.dueDate ? new Date(parsed.dueDate) : null,
        userId: user.id,
      },
      select: {
        id: true,
        title: true,
        completed: true,
        createdAt: true,
        updatedAt: true,
        dueDate: true,
      },
    })

    return todo
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
