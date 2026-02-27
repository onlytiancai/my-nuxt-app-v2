export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // 简单验证
  if (!body?.name) {
    throw createError({
      statusCode: 400,
      message: '姓名不能为空'
    })
  }

  // 模拟处理延迟
  await new Promise(resolve => setTimeout(resolve, 500))

  return {
    success: true,
    id: Date.now(),
    message: `欢迎，${body.name}！`,
    data: body
  }
})
