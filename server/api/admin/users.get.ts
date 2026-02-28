import { prisma } from '~~/server/utils/db'
import { isAdmin } from '~~/server/utils/db-auth'

/**
 * 获取所有用户列表（仅管理员）
 * 支持分页和搜索
 */
export default eventHandler(async (event) => {
  // 确保用户已登录
  const { user } = await requireUserSession(event)

  if (!user?.id) {
    throw createError({
      statusCode: 401,
      message: '未登录',
    })
  }

  // 检查是否为管理员
  const admin = await isAdmin(user.id)
  if (!admin) {
    throw createError({
      statusCode: 403,
      message: '需要管理员权限',
    })
  }

  const query = getQuery(event)
  const page = Number(query.page) || 1
  const pageSize = Number(query.pageSize) || 10
  const search = query.search as string | undefined

  const where = search
    ? {
        OR: [
          { email: { contains: search } },
          { name: { contains: search } },
        ],
      }
    : {}

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        accounts: true,
        _count: {
          select: {
            posts: true,
            todos: true,
          },
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where }),
  ])

  return {
    users,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  }
})
