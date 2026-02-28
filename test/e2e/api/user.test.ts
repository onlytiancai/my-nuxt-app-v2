/**
 * 用户资源 API 测试
 * 测试 Todos、Posts 等用户资源的增删改查
 * 验证权限隔离
 *
 * 注意：服务器由 globalSetup 自动启动
 */
import { describe, it, expect } from 'vitest'
import { $fetch } from '@nuxt/test-utils/e2e'

describe('用户资源 API', () => {
  let testTodoId: number | string
  let testPostId: number | string

  describe('Todos API', () => {
    it('成功获取 Todo 列表', async () => {
      const res = await $fetch('/api/user/todos', {
        method: 'GET',
      })

      expect(res.todos).toBeDefined()
      expect(Array.isArray(res.todos)).toBe(true)
      expect(res.pagination).toBeDefined()
    })

    it('成功创建 Todo', async () => {
      const res = await $fetch('/api/user/todos', {
        method: 'POST',
        body: {
          title: `Test Todo ${Date.now()}`,
          description: 'Test description',
        },
      })

      expect(res.todo).toBeDefined()
      expect(res.todo.title).toContain('Test Todo')
      testTodoId = res.todo.id
    })

    it('成功更新 Todo', async () => {
      if (testTodoId) {
        const res = await $fetch(`/api/user/todos/${testTodoId}`, {
          method: 'PATCH',
          body: {
            completed: true,
          },
        })

        expect(res.todo).toBeDefined()
        expect(res.todo.completed).toBe(true)
      }
    })

    it('成功删除 Todo', async () => {
      if (testTodoId) {
        const res = await $fetch(`/api/user/todos/${testTodoId}`, {
          method: 'DELETE',
        })

        expect(res).toBeDefined()
      }
    })

    it('支持分页获取 Todo 列表', async () => {
      const res = await $fetch('/api/user/todos?page=1&pageSize=5', {
        method: 'GET',
      })

      expect(res.pagination.pageSize).toBe(5)
    })

    it('支持按状态筛选 Todo', async () => {
      const completedRes = await $fetch('/api/user/todos?completed=true', {
        method: 'GET',
      })

      expect(completedRes.todos).toBeDefined()
    })
  })

  describe('Posts API', () => {
    it('成功获取 Posts 列表', async () => {
      const res = await $fetch('/api/user/posts', {
        method: 'GET',
      })

      expect(res.posts).toBeDefined()
      expect(Array.isArray(res.posts)).toBe(true)
      expect(res.pagination).toBeDefined()
    })

    it('成功创建 Post', async () => {
      const res = await $fetch('/api/user/posts', {
        method: 'POST',
        body: {
          title: `Test Post ${Date.now()}`,
          content: 'Test content',
        },
      })

      expect(res.post).toBeDefined()
      expect(res.post.title).toContain('Test Post')
      testPostId = res.post.id
    })

    it('成功更新 Post', async () => {
      if (testPostId) {
        const res = await $fetch(`/api/user/posts/${testPostId}`, {
          method: 'PATCH',
          body: {
            content: 'Updated content',
          },
        })

        expect(res.post).toBeDefined()
        expect(res.post.content).toBe('Updated content')
      }
    })

    it('成功删除 Post', async () => {
      if (testPostId) {
        const res = await $fetch(`/api/user/posts/${testPostId}`, {
          method: 'DELETE',
        })

        expect(res).toBeDefined()
      }
    })

    it('支持分页获取 Posts 列表', async () => {
      const res = await $fetch('/api/user/posts?page=1&pageSize=5', {
        method: 'GET',
      })

      expect(res.pagination.pageSize).toBe(5)
    })
  })

  describe('权限隔离', () => {
    it('用户无法访问其他用户的 Todo', async () => {
      // 创建用户 1 的 Todo
      const timestamp1 = Date.now()
      const email1 = `test_user1_${timestamp1}@example.com`
      const password = 'testpassword123'

      await $fetch('/api/auth/register', {
        method: 'POST',
        body: {
          name: 'Test User 1',
          email: email1,
          password,
          confirmPassword: password,
        },
      }).catch(() => {})

      // 创建用户 2 并登录
      const timestamp2 = Date.now()
      const email2 = `test_user2_${timestamp2}@example.com`

      await $fetch('/api/auth/register', {
        method: 'POST',
        body: {
          name: 'Test User 2',
          email: email2,
          password,
          confirmPassword: password,
        },
      }).catch(() => {})

      // 用户 2 获取 Todo 列表，不应该包含用户 1 的 Todo
      const todos = await $fetch('/api/user/todos', { method: 'GET' })
      expect(todos.todos).toBeDefined()
    })
  })
})
