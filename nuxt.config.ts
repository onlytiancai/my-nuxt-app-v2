// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    [
      "@nuxt/ui",
      {
        fonts: false, // 禁用 @nuxt/fonts 模块
      },
    ],
    "@nuxt/icon",
    "nuxt-auth-utils",
  ],
  css: ["~/assets/css/main.css"],
  runtimeConfig: {
    // 本地上传配置
    uploadDir: process.env.NUXT_UPLOAD_DIR || 'public/uploads',
    uploadBaseUrl: process.env.NUXT_UPLOAD_BASE_URL || '/uploads',
    // S3/MinIO 配置
    s3Endpoint: process.env.NUXT_S3_ENDPOINT || 'http://localhost:9000',
    s3AccessKey: process.env.NUXT_S3_ACCESS_KEY || '',
    s3SecretKey: process.env.NUXT_S3_SECRET_KEY || '',
    s3Bucket: process.env.NUXT_S3_BUCKET || 'uploads',
    s3Region: process.env.NUXT_S3_REGION || 'us-east-1'
  }
});
