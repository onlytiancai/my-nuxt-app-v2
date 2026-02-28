/**
 * 管理员 API 测试
 * 测试用户管理、帖子管理等功能
 *
 * 注意：服务器由 globalSetup 自动启动
 */
import { describe, it, expect } from 'vitest'
import { $fetch } from '@nuxt/test-utils/e2e'

describe('管理员 API', () => {
  let testUserId: string | number

  describe('用户列表 API', () => {
    it('成功获取用户列表（管理员）', async () => {
      const res = await $fetch('/api/admin/users', {
        method: 'GET',
      })

      expect(res.users).toBeDefined()
      expect(Array.isArray(res.users)).toBe(true)
      expect(res.pagination).toBeDefined()
      expect(res.pagination.page).toBe(1)
    })

    it('用户列表包含用户详细信息', async () => {
      const res = await $fetch('/api/admin/users', {
        method: 'GET',
      })

      if (res.users.length > 0) {
        const user = res.users[0]
        expect(user.id).toBeDefined()
        expect(user.email).toBeDefined()
        expect(user.name).toBeDefined()
        expect(user.role).toBeDefined()
        expect(user.createdAt).toBeDefined()
      }
    })

    it('支持搜索用户', async () => {
      const res = await $fetch('/api/admin/users?search=admin', {
        method: 'GET',
      })

      expect(res.users).toBeDefined()
      expect(Array.isArray(res.users)).toBe(true)
    })

    it('支持分页获取用户列表', async () => {
      const res = await $fetch('/api/admin/users?page=1&pageSize=5', {
        method: 'GET',
      })

      expect(res.pagination.pageSize).toBe(5)
      expect(res.users.length).toBeLessThanOrEqual(5)
    })
  })

  describe('用户详情 API', () => {
    it('成功获取用户详情', async () => {
      const listRes = await $fetch('/api/admin/users', {
        method: 'GET',
      })

      if (listRes.users.length > 0) {
        const userId = listRes.users[0].id
        const res = await $fetch(`/api/admin/users/${userId}`, {
          method: 'GET',
        })

        expect(res.user).toBeDefined()
        expect(res.user.id).toBe(userId)
      }
    })

    it('获取不存在的用户详情返回 404', async () => {
      await expect(
        $fetch('/api/admin/users/999999', {
          method: 'GET',
        })
      ).rejects.toMatchObject({
        statusCode: 404,
      })
    })
  })

  describe('用户更新 API', () => {
    it('成功更新用户信息', async () => {
      const timestamp = Date.now()
      const email = `test_update_${timestamp}@example.com`

      // 先创建一个测试用户
      try {
        await $fetch('/api/auth/register', {
          method: 'POST',
          body: {
            name: 'Test Update User',
            email,
            password: 'testpassword123',
            confirmPassword: 'testpassword123',
          },
        })
      } catch {
        // 用户可能已存在
      }

      // 获取用户 ID
      const listRes = await $fetch(`/api/admin/users?search=${email}`, {
        method: 'GET',
      })

      if (listRes.users.length > 0) {
        const userId = listRes.users[0].id
        testUserId = userId

        const res = await $fetch(`/api/admin/users/${userId}`, {
          method: 'PATCH',
          body: {
            name: 'Updated Name',
          },
        })

        expect(res.user).toBeDefined()
        expect(res.user.name).toBe('Updated Name')
      }
    })

    it('更新用户角色', async () => {
      if (testUserId) {
        const res = await $fetch(`/api/admin/users/${testUserId}`, {
          method: 'PATCH',
          body: {
            role: 'admin',
          },
        })

        expect(res.user.role).toBe('admin')

        // 恢复用户角色
        await $fetch(`/api/admin/users/${testUserId}`, {
          method: 'PATCH',
          body: {
            role: 'user',
          },
        })
      }
    })
  })

  describe('用户删除 API', () => {
    it('成功删除用户', async () => {
      const timestamp = Date.now()
      const email = `test_delete_${timestamp}@example.com`

      // 先创建一个测试用户
      try {
        await $fetch('/api/auth/register', {
          method: 'POST',
          body: {
            name: 'Test Delete User',
            email,
            password: 'testpassword123',
            confirmPassword: 'testpassword123',
          },
        })
      } catch {
        // 用户可能已存在
      }

      // 获取用户 ID
      const listRes = await $fetch(`/api/admin/users?search=${email}`, {
        method: 'GET',
      })

      if (listRes.users.length > 0) {
        const userId = listRes.users[0].id

        const res = await $fetch(`/api/admin/users/${userId}`, {
          method: 'DELETE',
        })

        expect(res).toBeDefined()
      }
    })
  })

  describe('帖子管理 API', () => {
    it('成功获取所有帖子列表', async () => {
      const res = await $fetch('/api/admin/posts', {
        method: 'GET',
      })

      expect(res.posts).toBeDefined()
      expect(Array.isArray(res.posts)).toBe(true)
      expect(res.pagination).toBeDefined()
    })

    it('支持分页获取帖子列表', async () => {
      const res = await $fetch('/api/admin/posts?page=1&pageSize=5', {
        method: 'GET',
      })

      expect(res.pagination.pageSize).toBe(5)
    })
  })
})
