import { prisma } from '~~/server/utils/db'

/**
 * 获取当前用户的帖子列表
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
  const pageSize = Number(query.pageSize) || 10
  const published = query.published as string | undefined

  const where: any = { authorId: user.id }
  if (published !== undefined) {
    where.published = published === 'true'
  }

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      select: {
        id: true,
        title: true,
        content: true,
        published: true,
        createdAt: true,
        updatedAt: true,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.post.count({ where }),
  ])

  return {
    posts,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  }
})
