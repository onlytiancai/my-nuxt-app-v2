import { prisma } from '~~/server/utils/db'

/**
 * 获取当前用户的 todo 列表
 */
export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  if (!user?.id) {
    throw createError({
      statusCode: 401,
      message: '未登录',
    })
  }

  const query = getQuery(event)
  const page = Number(query.page) || 1
  const pageSize = Number(query.pageSize) || 20
  const completed = query.completed as string | undefined

  const where: any = { userId: user.id }
  if (completed !== undefined) {
    where.completed = completed === 'true'
  }

  const [todos, total] = await Promise.all([
    prisma.todo.findMany({
      where,
      select: {
        id: true,
        title: true,
        completed: true,
        createdAt: true,
        updatedAt: true,
        dueDate: true,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.todo.count({ where }),
  ])

  return {
    todos,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  }
})
