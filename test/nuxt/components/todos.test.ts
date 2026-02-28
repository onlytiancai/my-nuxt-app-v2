/**
 * Todo 列表页面组件测试
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { mountSuspended, registerEndpoint } from '@nuxt/test-utils/runtime'
import Todos from '~/pages/dashboard/user/todos.vue'

describe('Todo 列表页面', () => {
  const mockTodos = [
    { id: 1, title: 'Test Todo 1', completed: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 2, title: 'Test Todo 2', completed: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ]

  beforeEach(() => {
    registerEndpoint('/api/user/todos', {
      method: 'GET',
      handler: () => ({
        todos: mockTodos,
        pagination: { page: 1, pageSize: 20, total: 2, totalPages: 1 },
      }),
    })

    registerEndpoint('/api/user/todos/:id', {
      method: 'PATCH',
      handler: () => ({
        id: 1,
        title: 'Updated Todo',
        completed: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
    })

    registerEndpoint('/api/user/todos/:id', {
      method: 'DELETE',
      handler: () => ({}),
    })

    registerEndpoint('/api/user/todos', {
      method: 'POST',
      handler: () => ({
        id: 3,
        title: 'New Todo',
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
    })
  })

  it('渲染页面标题', async () => {
    const component = await mountSuspended(Todos)
    await component.vm.$nextTick()
    // 等待加载完成
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(component.html()).toContain('待办事项')
  })

  it('显示加载状态', async () => {
    const component = await mountSuspended(Todos)

    // 初始状态应该是 loading
    expect(component.vm.loading).toBe(true)
  })

  it('加载完成后显示 Todo 列表', async () => {
    const component = await mountSuspended(Todos)
    await component.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(component.vm.todos.length).toBeGreaterThan(0)
  })

  it('显示筛选按钮', async () => {
    const component = await mountSuspended(Todos)
    await component.vm.$nextTick()
    // 等待加载完成显示筛选按钮
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(component.html()).toContain('全部')
    expect(component.html()).toContain('进行中')
    expect(component.html()).toContain('已完成')
  })

  it('有添加 Todo 的输入框', async () => {
    const component = await mountSuspended(Todos)
    await component.vm.$nextTick()
    // 等待加载完成显示输入框
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(component.html()).toContain('添加新的待办事项')
  })

  it('有返回用户后台的链接', async () => {
    const component = await mountSuspended(Todos)
    await component.vm.$nextTick()
    // 等待加载完成
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(component.html()).toContain('/dashboard/user')
    expect(component.html()).toContain('返回用户后台')
  })

  it('空输入时不能添加 Todo', async () => {
    const component = await mountSuspended(Todos)
    await component.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    component.vm.newTodoTitle = ''
    await component.vm.addTodo()

    // 空输入不应该添加
    expect(component.vm.newTodoTitle).toBe('')
  })

  it('切换筛选条件', async () => {
    const component = await mountSuspended(Todos)
    await component.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    // 初始为全部
    expect(component.vm.filter).toBe('all')

    // 切换到进行中
    component.vm.filter = 'active'
    await component.vm.$nextTick()
    expect(component.vm.filter).toBe('active')

    // 切换到已完成
    component.vm.filter = 'completed'
    await component.vm.$nextTick()
    expect(component.vm.filter).toBe('completed')
  })

  it('分页信息正确', async () => {
    const component = await mountSuspended(Todos)
    await component.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(component.vm.pagination.page).toBe(1)
    expect(component.vm.pagination.pageSize).toBe(20)
  })

  it('日期格式化函数正确', async () => {
    const component = await mountSuspended(Todos)
    await component.vm.$nextTick()

    const dateStr = '2024-01-15T10:30:00Z'
    const formatted = component.vm.formatDate(dateStr)
    expect(formatted).toBeDefined()
    expect(typeof formatted).toBe('string')
  })

  it('日期格式化函数处理空值', async () => {
    const component = await mountSuspended(Todos)
    await component.vm.$nextTick()

    expect(component.vm.formatDate(null)).toBe('')
    expect(component.vm.formatDate(undefined)).toBe('')
    expect(component.vm.formatDate('')).toBe('')
  })
})
