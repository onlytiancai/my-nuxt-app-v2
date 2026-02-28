import { prisma } from '~~/server/utils/db'
import { z } from 'zod'

/**
 * 创建新的帖子
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

    // 验证请求体
    const schema = z.object({
      title: z.string().min(1, '标题不能为空'),
      content: z.string().optional(),
      published: z.boolean().optional().default(false),
    })

    const parsed = schema.parse(body)

    const post = await prisma.post.create({
      data: {
        title: parsed.title,
        content: parsed.content,
        published: parsed.published,
        authorId: user.id,
      },
      select: {
        id: true,
        title: true,
        content: true,
        published: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return post
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
