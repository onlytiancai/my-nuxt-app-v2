import { z } from 'zod'
import { dbHashPassword, findUserByEmail, createUser } from '../../utils/db-auth'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    // 验证请求体
    const schema = z.object({
      name: z.string().min(2, '用户名至少需要 2 个字符'),
      email: z.string().email('请输入有效的邮箱地址'),
      password: z.string().min(6, '密码至少需要 6 个字符'),
      confirmPassword: z.string(),
    }).refine((data) => data.password === data.confirmPassword, {
      message: '两次输入的密码不一致',
      path: ['confirmPassword'],
    })

    const parsed = schema.parse(body)

    // 检查邮箱是否已存在
    const existingUser = await findUserByEmail(parsed.email)

    if (existingUser) {
      throw createError({
        statusCode: 409,
        message: '该邮箱已被注册',
      })
    }

    // 哈希密码
    const hashedPassword = await dbHashPassword(parsed.password)

    // 创建用户
    const user = await createUser({
      email: parsed.email,
      name: parsed.name,
      password: hashedPassword,
    })

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
