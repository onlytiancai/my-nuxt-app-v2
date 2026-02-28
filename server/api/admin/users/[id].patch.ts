import { prisma } from '~~/server/utils/db'
import { isAdmin } from '~~/server/utils/db-auth'
import { z } from 'zod'

/**
 * 更新用户信息（仅管理员）
 * 可以更新用户角色、姓名等
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

  try {
    const body = await readBody(event)

    const schema = z.object({
      name: z.string().optional(),
      avatar: z.string().optional(),
      role: z.enum(['USER', 'ADMIN']).optional(),
    })

    const parsed = schema.parse(body)

    // 检查用户是否存在
    const existingUser = await prisma.user.findUnique({
      where: { id: Number(userId) },
    })

    if (!existingUser) {
      throw createError({
        statusCode: 404,
        message: '用户不存在',
      })
    }

    // 不允许删除自己的管理员权限
    if (user.id === Number(userId) && parsed.role === 'USER' && existingUser.role === 'ADMIN') {
      throw createError({
        statusCode: 400,
        message: '不能移除自己的管理员权限',
      })
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(userId) },
      data: parsed,
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        updatedAt: true,
      },
    })

    return updatedUser
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
