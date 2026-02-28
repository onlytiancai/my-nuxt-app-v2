/**
 * E2E 测试设置
 * 注意：@nuxt/test-utils/e2e 的 setup() 需要在测试上下文中调用
 * 由于 vitest v4 的限制，建议在每个测试文件中显式调用 setup()
 *
 * 使用方法：
 * 1. 在测试文件的 beforeAll 中调用 setup()
 * 2. 使用全局变量确保只调用一次
 */

// 导出 setup 函数供测试文件使用
export { setup } from '@nuxt/test-utils/e2e'

// 全局标志
declare global {
  var __nuxtE2ESetupDone: boolean
}
