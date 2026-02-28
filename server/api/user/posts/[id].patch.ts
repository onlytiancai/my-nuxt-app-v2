import { prisma } from '~~/server/utils/db'
import { z } from 'zod'

/**
 * 更新帖子
 */
export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  if (!user?.id) {
    throw createError({
      statusCode: 401,
      message: '未登录',
    })
  }

  const postId = getRouterParam(event, 'id')

  if (!postId || isNaN(Number(postId))) {
    throw createError({
      statusCode: 400,
      message: '无效的帖子 ID',
    })
  }

  const postIdNum = Number(postId)

  // 检查帖子是否存在且属于当前用户
  const existingPost = await prisma.post.findUnique({
    where: { id: postIdNum },
  })

  if (!existingPost) {
    throw createError({
      statusCode: 404,
      message: '帖子不存在',
    })
  }

  if (existingPost.authorId !== user.id) {
    throw createError({
      statusCode: 403,
      message: '无权修改此帖子',
    })
  }

  try {
    const body = await readBody(event)

    const schema = z.object({
      title: z.string().optional(),
      content: z.string().optional(),
      published: z.boolean().optional(),
    })

    const parsed = schema.parse(body)

    const updatedPost = await prisma.post.update({
      where: { id: postIdNum },
      data: parsed,
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

    return updatedPost
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
