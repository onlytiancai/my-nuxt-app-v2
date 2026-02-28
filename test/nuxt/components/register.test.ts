/**
 * 注册页面组件测试
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { mountSuspended, registerEndpoint } from '@nuxt/test-utils/runtime'
import Register from '~/pages/register.vue'

describe('注册页面', () => {
  beforeEach(() => {
    registerEndpoint('/api/auth/register', {
      method: 'POST',
      handler: () => ({
        user: {
          id: 1,
          email: 'test@example.com',
          name: 'Test User',
          role: 'user',
        },
      }),
    })
  })

  it('渲染注册表单', async () => {
    const component = await mountSuspended(Register)

    expect(component.html()).toContain('创建账户')
    expect(component.html()).toContain('注册一个新账户开始使用')
    expect(component.html()).toContain('用户名')
    expect(component.html()).toContain('邮箱')
    expect(component.html()).toContain('密码')
    expect(component.html()).toContain('确认密码')
  })

  it('显示 OAuth 注册选项', async () => {
    const component = await mountSuspended(Register)

    expect(component.html()).toContain('GitHub')
    expect(component.html()).toContain('Google')
  })

  it('初始状态没有密码强度显示', async () => {
    const component = await mountSuspended(Register)

    expect(component.html()).not.toContain('密码强度')
  })

  it('输入密码后显示强度指示器', async () => {
    const component = await mountSuspended(Register)

    // 设置密码
    component.vm.form.password = 'test123'
    await component.vm.$nextTick()

    expect(component.html()).toContain('密码强度')
  })

  it('密码强度计算正确 - 弱密码', async () => {
    const component = await mountSuspended(Register)

    component.vm.form.password = '123'
    await component.vm.$nextTick()

    expect(component.vm.passwordStrength).toBeLessThanOrEqual(1)
    expect(component.vm.passwordStrengthText).toBe('非常弱')
  })

  it('密码强度计算正确 - 中等密码', async () => {
    const component = await mountSuspended(Register)

    component.vm.form.password = 'test123'
    await component.vm.$nextTick()

    expect(component.vm.passwordStrength).toBeGreaterThanOrEqual(2)
  })

  it('密码强度计算正确 - 强密码', async () => {
    const component = await mountSuspended(Register)

    component.vm.form.password = 'Test123!'
    await component.vm.$nextTick()

    expect(component.vm.passwordStrength).toBeGreaterThanOrEqual(3)
  })

  it('验证 - 未同意条款时显示错误', async () => {
    const component = await mountSuspended(Register)

    component.vm.form.agree = false
    component.vm.form.password = 'password123'
    component.vm.form.confirmPassword = 'password123'

    // 模拟表单提交
    await component.vm.handleRegister()

    expect(component.vm.error).toContain('同意')
  })

  it('验证 - 密码过短时显示错误', async () => {
    const component = await mountSuspended(Register)

    component.vm.form.password = '123'
    component.vm.form.confirmPassword = '123'
    component.vm.form.agree = true

    await component.vm.handleRegister()

    expect(component.vm.passwordError).toContain('密码')
  })

  it('验证 - 两次密码不一致时显示错误', async () => {
    const component = await mountSuspended(Register)

    component.vm.form.password = 'password123'
    component.vm.form.confirmPassword = 'password456'
    component.vm.form.agree = true

    await component.vm.handleRegister()

    expect(component.vm.error).toContain('密码')
  })

  it('包含跳转到登录页面的链接', async () => {
    const component = await mountSuspended(Register)

    expect(component.html()).toContain('/login')
    expect(component.html()).toContain('立即登录')
  })

  it('包含跳转到首页的链接', async () => {
    const component = await mountSuspended(Register)

    expect(component.html()).toContain('/')
    expect(component.html()).toContain('返回首页')
  })

  it('有服务条款和隐私政策链接', async () => {
    const component = await mountSuspended(Register)

    expect(component.html()).toContain('服务条款')
    expect(component.html()).toContain('隐私政策')
  })

  it('复选框默认未勾选', async () => {
    const component = await mountSuspended(Register)

    expect(component.vm.form.agree).toBe(false)
  })
})
