/**
 * E2E API 测试 - 全局设置
 * 使用 Vitest 的 globalSetup 启动服务器
 */
import { setup } from '@nuxt/test-utils/e2e'

export default async function setupGlobal() {
  await setup({
    server: true,
    browser: false,
    setupTimeout: 120000,
    teardownTimeout: 30000,
    build: true,
  })
}
