import { z } from 'zod'
import { dbVerifyPassword, findUserByEmail } from '../../utils/db-auth'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    // 验证请求体
    const schema = z.object({
      email: z.string().email('请输入有效的邮箱地址'),
      password: z.string().min(6, '密码至少需要 6 个字符'),
    })

    const parsed = schema.parse(body)

    // 查找用户
    const user = await findUserByEmail(parsed.email)

    if (!user || !user.password) {
      throw createError({
        statusCode: 401,
        message: '邮箱或密码错误',
      })
    }

    // 验证密码
    const isValid = await dbVerifyPassword(parsed.password, user.password)

    if (!isValid) {
      throw createError({
        statusCode: 401,
        message: '邮箱或密码错误',
      })
    }

    // 设置用户会话
    await setUserSession(event, {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
        hasPassword: !!user.password,
      },
    })

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
      },
    }
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
