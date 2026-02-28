/**
 * 用户资源 API 测试
 * 测试 Todos、Posts 等用户资源的增删改查
 * 验证权限隔离
 */
import { describe, it, expect, beforeAll } from 'vitest'
import { $fetch, setup } from '@nuxt/test-utils/e2e'

describe('用户资源 API', () => {
  let testUserCookie: string
  let testTodoId: number | string
  let testPostId: number | string

  beforeAll(async () => {
    await setup({
      server: true,
      browser: false,
      setupTimeout: 120000,
      teardownTimeout: 30000,
      build: true,
    })

    // 创建测试用户并登录
    const timestamp = Date.now()
    const email = `test_resource_${timestamp}@example.com`
    const password = 'testpassword123'

    try {
      // 注册用户
      await $fetch('/api/auth/register', {
        method: 'POST',
        body: {
          name: 'Test Resource User',
          email,
          password,
          confirmPassword: password,
        },
      })
    } catch {
      // 用户可能已存在
    }

    // 登录
    try {
      await $fetch('/api/auth/login', {
        method: 'POST',
        body: {
          email,
          password,
        },
      })
    } catch {
      console.warn('测试用户登录失败')
    }
  })

  describe('Todos API', () => {
    it('未登录时获取 Todos 返回 401', async () => {
      // 先登出
      await $fetch('/api/auth/logout', { method: 'POST' }).catch(() => {})

      await expect(
        $fetch('/api/user/todos', { method: 'GET' })
      ).rejects.toMatchObject({
        statusCode: 401,
      })

      // 重新登录
      const timestamp = Date.now()
      const email = `test_resource_${timestamp}@example.com`
      await $fetch('/api/auth/login', {
        method: 'POST',
        body: {
          email,
          password: 'testpassword123',
        },
      }).catch(() => {})
    })

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

        // 验证 Todo 已被删除
        const listRes = await $fetch('/api/user/todos', { method: 'GET' })
        const deletedTodo = listRes.todos.find((t: any) => t.id === testTodoId)
        expect(deletedTodo).toBeUndefined()
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
      // 所有返回的 Todo 都应该是已完成的
      completedRes.todos.forEach((todo: any) => {
        expect(todo.completed).toBe(true)
      })
    })
  })

  describe('Posts API', () => {
    it('未登录时获取 Posts 返回 401', async () => {
      // 先登出
      await $fetch('/api/auth/logout', { method: 'POST' }).catch(() => {})

      await expect(
        $fetch('/api/user/posts', { method: 'GET' })
      ).rejects.toMatchObject({
        statusCode: 401,
      })

      // 重新登录
      const timestamp = Date.now()
      const email = `test_resource_${timestamp}@example.com`
      await $fetch('/api/auth/login', {
        method: 'POST',
        body: {
          email,
          password: 'testpassword123',
        },
      }).catch(() => {})
    })

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

        // 验证 Post 已被删除
        const listRes = await $fetch('/api/user/posts', { method: 'GET' })
        const deletedPost = listRes.posts.find((p: any) => p.id === testPostId)
        expect(deletedPost).toBeUndefined()
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
    let user1TodoId: number | string
    let user2TodoId: number | string

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

      await $fetch('/api/auth/login', {
        method: 'POST',
        body: {
          email: email1,
          password,
        },
      }).catch(() => {})

      const todoRes = await $fetch('/api/user/todos', {
        method: 'POST',
        body: {
          title: 'User 1 Todo',
          description: 'This is user 1 todo',
        },
      })
      user1TodoId = todoRes.todo.id

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

      await $fetch('/api/auth/login', {
        method: 'POST',
        body: {
          email: email2,
          password,
        },
      }).catch(() => {})

      const todoRes2 = await $fetch('/api/user/todos', {
        method: 'POST',
        body: {
          title: 'User 2 Todo',
          description: 'This is user 2 todo',
        },
      })
      user2TodoId = todoRes2.todo.id

      // 用户 2 尝试访问用户 1 的 Todo - 应该返回 404 或无法访问
      // 注意：这取决于具体实现，如果 API 设计为按用户隔离，应该返回空或 404
      const todos = await $fetch('/api/user/todos', { method: 'GET' })
      const user1TodoInUser2List = todos.todos.find((t: any) => t.id === user1TodoId)
      expect(user1TodoInUser2List).toBeUndefined()

      // 用户 2 尝试更新用户 1 的 Todo - 应该失败
      await expect(
        $fetch(`/api/user/todos/${user1TodoId}`, {
          method: 'PATCH',
          body: { completed: true },
        })
      ).rejects.toMatchObject({
        statusCode: 404,
      })

      // 用户 2 尝试删除用户 1 的 Todo - 应该失败
      await expect(
        $fetch(`/api/user/todos/${user1TodoId}`, {
          method: 'DELETE',
        })
      ).rejects.toMatchObject({
        statusCode: 404,
      })
    })

    it('用户只能访问自己的 Posts', async () => {
      // 获取当前用户的 Posts 列表
      const res = await $fetch('/api/user/posts', { method: 'GET' })

      // 不应该包含其他用户的 Post
      const otherUserPost = res.posts.find((p: any) => p.id === user1TodoId)
      expect(otherUserPost).toBeUndefined()
    })
  })
})
