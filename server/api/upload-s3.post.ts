import { defineEventHandler, readMultipartFormData, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  // S3/MinIO 配置
  const s3Config = {
    endpoint: config.s3Endpoint || 'http://localhost:9000',
    accessKeyId: config.s3AccessKey || '',
    secretAccessKey: config.s3SecretKey || '',
    bucket: config.s3Bucket || 'uploads',
    region: config.s3Region || 'us-east-1'
  }

  // 如果没有配置 S3，返回错误
  if (!s3Config.accessKeyId || !s3Config.secretAccessKey) {
    return {
      success: false,
      message: 'S3 配置未完成，请检查环境变量',
      demoMode: true,
      demoFiles: [] as Array<{
        name: string
        size: number
        type: string
        url: string
      }>
    }
  }

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
      key: string
      url: string
      etag?: string
    }> = []

    // 动态导入 AWS SDK
    const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3')

    const s3Client = new S3Client({
      endpoint: s3Config.endpoint,
      credentials: {
        accessKeyId: s3Config.accessKeyId,
        secretAccessKey: s3Config.secretAccessKey
      },
      region: s3Config.region,
      forcePathStyle: true // MinIO 需要这个配置
    })

    for (const item of formData) {
      if (item.data instanceof Buffer && item.filename) {
        const timestamp = Date.now()
        const randomStr = Math.random().toString(36).substring(2, 8)
        const ext = item.filename.split('.').pop()
        const key = `uploads/${timestamp}_${randomStr}.${ext}`

        // 上传到 S3
        const command = new PutObjectCommand({
          Bucket: s3Config.bucket,
          Key: key,
          Body: item.data,
          ContentType: item.type || 'application/octet-stream'
        })

        const response = await s3Client.send(command)

        // 构建文件 URL
        const fileUrl = s3Config.endpoint.endsWith('/')
          ? `${s3Config.endpoint}${s3Config.bucket}/${key}`
          : `${s3Config.endpoint}/${s3Config.bucket}/${key}`

        uploadedFiles.push({
          name: item.filename,
          size: item.data.length,
          type: item.type || 'application/octet-stream',
          key,
          url: fileUrl,
          etag: response.ETag
        })
      }
    }

    return {
      success: true,
      files: uploadedFiles,
      message: `成功上传 ${uploadedFiles.length} 个文件到 S3`
    }
  } catch (error) {
    console.error('S3 Upload error:', error)

    // 如果是 SDK 导入失败，提供友好的提示
    if (error instanceof Error && error.message.includes('Cannot resolve')) {
      return {
        success: false,
        message: '请安装 AWS SDK: pnpm add @aws-sdk/client-s3',
        demoMode: true
      }
    }

    throw createError({
      statusCode: 500,
      message: error instanceof Error ? error.message : 'S3 上传失败'
    })
  }
})
