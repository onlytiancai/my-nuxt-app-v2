export default defineEventHandler(() => {
  return {
    message: '你好，欢迎使用 Nuxt API！',
    timestamp: new Date().toISOString()
  }
})
