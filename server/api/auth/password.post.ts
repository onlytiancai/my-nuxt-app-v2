import { z } from 'zod'
import { updateUserPassword, dbVerifyPassword, findUserById } from '../../utils/db-auth'

export default defineEventHandler(async (event) => {
  // 需要用户已登录
  const session = await requireUserSession(event)

  const body = await readBody(event)

  // 验证请求体
  const schema = z.object({
    currentPassword: z.string().optional(),
    newPassword: z.string().min(6, '新密码至少需要 6 个字符'),
    confirmPassword: z.string(),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: '两次输入的新密码不一致',
    path: ['confirmPassword'],
  })

  try {
    const parsed = schema.parse(body)

    // 获取完整用户信息（包括 password 字段）
    const user = await findUserById(session.user.id)

    if (!user) {
      throw createError({
        statusCode: 404,
        message: '用户不存在',
      })
    }

    // 如果用户已有密码，需要验证当前密码
    if (user.password && parsed.currentPassword) {
      const isValid = await dbVerifyPassword(parsed.currentPassword, user.password)
      if (!isValid) {
        throw createError({
          statusCode: 400,
          message: '当前密码错误',
        })
      }
    } else if (user.password && !parsed.currentPassword) {
      throw createError({
        statusCode: 400,
        message: '请输入当前密码',
      })
    }

    // 更新密码
    await updateUserPassword(session.user.id, parsed.newPassword)

    return { success: true }
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
