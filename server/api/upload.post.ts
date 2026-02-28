import { defineEventHandler, readMultipartFormData, createError } from 'h3'
import { join } from 'pathe'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  try {
    const formData = await readMultipartFormData(event)

    if (!formData) {
      throw createError({
        statusCode: 400,
        message: '无效的表单数据'
      })
    }

    const uploadedFiles: Array<{
      name: string
      size: number
      type: string
      path: string
      url: string
    }> = []

    for (const item of formData) {
      if (item.data instanceof Buffer && item.filename) {
        // 生成分布式友好的文件名
        const timestamp = Date.now()
        const randomStr = Math.random().toString(36).substring(2, 8)
        const ext = item.filename.split('.').pop()
        const safeFilename = `${timestamp}_${randomStr}.${ext}`

        // 本地存储路径（支持绝对路径和相对路径）
        const uploadDir = config.uploadDir.startsWith('/')
          ? config.uploadDir
          : join(config.rootDir, config.uploadDir)
        const filePath = join(uploadDir, safeFilename)

        // 确保目录存在
        await import('node:fs/promises').then(({ mkdir }) =>
          mkdir(uploadDir, { recursive: true })
        )

        // 写入文件
        await import('node:fs/promises').then(({ writeFile }) =>
          writeFile(filePath, item.data)
        )

        uploadedFiles.push({
          name: item.filename,
          size: item.data.length,
          type: item.type || 'application/octet-stream',
          path: filePath,
          url: `${config.uploadBaseUrl}/${safeFilename}`
        })
      }
    }

    return {
      success: true,
      files: uploadedFiles,
      message: `成功上传 ${uploadedFiles.length} 个文件`
    }
  } catch (error) {
    console.error('Upload error:', error)
    throw createError({
      statusCode: 500,
      message: error instanceof Error ? error.message : '上传失败'
    })
  }
})
