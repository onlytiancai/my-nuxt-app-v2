// API 测试 Setup - 启动 Nuxt 服务器
import { setup } from '@nuxt/test-utils/e2e'

export default async function setupApi() {
  await setup({
    server: true,
    browser: false,
    setupTimeout: 120000,
    teardownTimeout: 30000,
    build: true,
  })
}
