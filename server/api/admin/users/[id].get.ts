import { prisma } from '~~/server/utils/db'
import { isAdmin } from '~~/server/utils/db-auth'

/**
 * 获取单个用户详情（仅管理员）
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

  const userId = getRouterParam(event, 'id')

  if (!userId || isNaN(Number(userId))) {
    throw createError({
      statusCode: 400,
      message: '无效的用户 ID',
    })
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: Number(userId) },
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      accounts: true,
      posts: {
        select: {
          id: true,
          title: true,
          published: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      todos: {
        select: {
          id: true,
          title: true,
          completed: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  })

  if (!targetUser) {
    throw createError({
      statusCode: 404,
      message: '用户不存在',
    })
  }

  return targetUser
})
