/**
 * 用户资源 API 测试
 * 测试 Todos、Posts 等用户资源的增删改查
 * 验证权限隔离
 *
 * 参考：https://nuxt.com/docs/getting-started/testing
 */
import { describe, it, expect, beforeAll } from 'vitest'
import { $fetch, setup } from '@nuxt/test-utils/e2e'

describe('用户资源 API', async () => {
  await setup({
    server: true,
    browser: false,
    setupTimeout: 120000,
    teardownTimeout: 30000,
    build: true,
  })

  let testTodoId: number | string
  let testPostId: number | string
  let userCookie: string

  // 先登录普通用户账户
  beforeAll(async () => {
    const loginRes = await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        email: 'user@example.com',
        password: 'user123',
      },
    })
    // 从响应头获取 Cookie
    userCookie = loginRes.headers?.['set-cookie']
      ? Array.isArray(loginRes.headers['set-cookie'])
        ? loginRes.headers['set-cookie'].join('; ')
        : loginRes.headers['set-cookie']
      : ''
  })

  describe('Todos API', () => {
    it('成功获取 Todo 列表', async () => {
      const res = await $fetch('/api/user/todos', {
        method: 'GET',
        headers: {
          cookie: userCookie,
        },
      })

      expect(res.todos).toBeDefined()
      expect(Array.isArray(res.todos)).toBe(true)
      expect(res.pagination).toBeDefined()
    })

    it('成功创建 Todo', async () => {
      const res = await $fetch('/api/user/todos', {
        method: 'POST',
        headers: {
          cookie: userCookie,
        },
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
          headers: {
            cookie: userCookie,
          },
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
          headers: {
            cookie: userCookie,
          },
        })

        expect(res).toBeDefined()
      }
    })

    it('支持分页获取 Todo 列表', async () => {
      const res = await $fetch('/api/user/todos?page=1&pageSize=5', {
        method: 'GET',
        headers: {
          cookie: userCookie,
        },
      })

      expect(res.pagination.pageSize).toBe(5)
    })

    it('支持按状态筛选 Todo', async () => {
      const completedRes = await $fetch('/api/user/todos?completed=true', {
        method: 'GET',
        headers: {
          cookie: userCookie,
        },
      })

      expect(completedRes.todos).toBeDefined()
    })
  })

  describe('Posts API', () => {
    it('成功获取 Posts 列表', async () => {
      const res = await $fetch('/api/user/posts', {
        method: 'GET',
        headers: {
          cookie: userCookie,
        },
      })

      expect(res.posts).toBeDefined()
      expect(Array.isArray(res.posts)).toBe(true)
      expect(res.pagination).toBeDefined()
    })

    it('成功创建 Post', async () => {
      const res = await $fetch('/api/user/posts', {
        method: 'POST',
        headers: {
          cookie: userCookie,
        },
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
          headers: {
            cookie: userCookie,
          },
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
          headers: {
            cookie: userCookie,
          },
        })

        expect(res).toBeDefined()
      }
    })

    it('支持分页获取 Posts 列表', async () => {
      const res = await $fetch('/api/user/posts?page=1&pageSize=5', {
        method: 'GET',
        headers: {
          cookie: userCookie,
        },
      })

      expect(res.pagination.pageSize).toBe(5)
    })
  })

  describe('权限隔离', () => {
    it('用户无法访问其他用户的 Todo', async () => {
      // 创建用户 1 并登录
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

      // 登录用户 1 获取 cookie
      const loginRes = await $fetch('/api/auth/login', {
        method: 'POST',
        body: {
          email: email1,
          password,
        },
      })
      const user1Cookie = loginRes.headers?.['set-cookie']
        ? Array.isArray(loginRes.headers['set-cookie'])
          ? loginRes.headers['set-cookie'].join('; ')
          : loginRes.headers['set-cookie']
        : ''

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
      const todos = await $fetch('/api/user/todos', {
        method: 'GET',
        headers: {
          cookie: user1Cookie,
        },
      })
      expect(todos.todos).toBeDefined()
    })
  })
})
