import { prisma } from '~~/server/utils/db'
import { isAdmin } from '~~/server/utils/db-auth'

/**
 * 删除用户（仅管理员）
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

  const userIdNum = Number(userId)

  // 检查用户是否存在
  const existingUser = await prisma.user.findUnique({
    where: { id: userIdNum },
  })

  if (!existingUser) {
    throw createError({
      statusCode: 404,
      message: '用户不存在',
    })
  }

  // 不允许删除自己
  if (user.id === userIdNum) {
    throw createError({
      statusCode: 400,
      message: '不能删除自己',
    })
  }

  // 删除用户（级联删除相关的 posts 和 todos）
  await prisma.user.delete({
    where: { id: userIdNum },
  })

  return { success: true, message: '用户已删除' }
})
