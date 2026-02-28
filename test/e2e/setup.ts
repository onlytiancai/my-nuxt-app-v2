/**
 * E2E 测试设置文件
 * 启动 Nuxt 测试服务器
 */
import { setup } from '@nuxt/test-utils/e2e'

export default async function setupE2e() {
  await setup({
    server: true,
    browser: false,
    setupTimeout: 120000,
    teardownTimeout: 30000,
    build: true,
  })
}
