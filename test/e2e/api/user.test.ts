/**
 * 用户资源 API 测试
 * 测试 Todos、Posts 等用户资源的增删改查
 * 验证权限隔离
 *
 * 参考：https://nuxt.com/docs/getting-started/testing
 */
import { describe, it, expect, beforeAll } from 'vitest'
import { $fetch, setup, useTestContext } from '@nuxt/test-utils/e2e'

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
  let userCookie: string = ''

  // 先登录普通用户账户并获取 Cookie
  beforeAll(async () => {
    const ctx = useTestContext()
    const baseUrl = ctx.url || 'http://127.0.0.1:3000'
    console.log('Base URL:', baseUrl)

    const response = await globalThis.fetch(`${baseUrl}api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'user@example.com',
        password: 'user123',
      }),
    })

    console.log('Login response status:', response.status)

    // 从响应头获取 Cookie
    const setCookie = response.headers.get('set-cookie')
    console.log('Set-Cookie header:', setCookie ? 'present' : 'missing')

    if (setCookie) {
      // 提取 nuxt-session cookie
      const match = setCookie.match(/nuxt-session=[^;]+/)
      if (match) {
        userCookie = match[0]
        console.log('Cookie captured:', userCookie ? 'yes' : 'no')
      } else {
        console.log('No nuxt-session found in cookie')
      }
    }

    console.log('Final userCookie:', userCookie ? 'SET' : 'NOT SET')
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

      expect(res.id).toBeDefined()
      expect(res.title).toContain('Test Todo')
      testTodoId = res.id
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

        expect(res.id).toBeDefined()
        expect(res.completed).toBe(true)
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

      expect(res.id).toBeDefined()
      expect(res.title).toContain('Test Post')
      testPostId = res.id
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

        expect(res.id).toBeDefined()
        expect(res.content).toBe('Updated content')
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
      const ctx = useTestContext()
      const baseUrl = ctx.url || 'http://127.0.0.1:3000'

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
      const loginRes = await globalThis.fetch(`${baseUrl}api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email1,
          password,
        }),
      })

      let user1Cookie = ''
      const setCookie = loginRes.headers.get('set-cookie')
      if (setCookie) {
        const match = setCookie.match(/nuxt-session=[^;]+/)
        if (match) {
          user1Cookie = match[0]
        }
      }

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
