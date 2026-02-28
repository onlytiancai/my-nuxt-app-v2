import { prisma } from '~~/server/utils/db'

/**
 * 删除帖子
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
      message: '无权删除此帖子',
    })
  }

  await prisma.post.delete({
    where: { id: postIdNum },
  })

  return { success: true, message: '帖子已删除' }
})
