<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-8 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- Back to Admin Dashboard -->
      <NuxtLink
        to="/dashboard/admin"
        class="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        返回管理后台
      </NuxtLink>

      <!-- Loading State -->
      <div v-if="loading" class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
        <div class="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto"></div>
        <p class="text-white/80 mt-4">加载中...</p>
      </div>

      <!-- User Management -->
      <div v-else class="space-y-6">
        <!-- Header -->
        <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h1 class="text-2xl font-bold text-white mb-4">用户管理</h1>

          <!-- Search Bar -->
          <div class="flex gap-3">
            <UInput
              v-model="searchQuery"
              placeholder="搜索用户邮箱或姓名..."
              class="flex-1"
              @keyup.enter="handleSearch"
            />
            <UButton color="white" @click="handleSearch">
              搜索
            </UButton>
            <UButton color="white" variant="outline" @click="resetSearch">
              重置
            </UButton>
          </div>
        </div>

        <!-- Users Table -->
        <div class="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
          <table class="w-full">
            <thead class="bg-white/10">
              <tr>
                <th class="px-6 py-4 text-left text-sm font-semibold text-white">用户</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-white">角色</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-white">连接方式</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-white">统计</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-white">注册时间</th>
                <th class="px-6 py-4 text-right text-sm font-semibold text-white">操作</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/10">
              <tr v-for="userItem in users" :key="userItem.id" class="hover:bg-white/5 transition-colors">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <UAvatar :src="userItem.avatar" :alt="userItem.name" size="md" class="bg-white/20" />
                    <div>
                      <p class="text-white font-medium">{{ userItem.name || '未设置姓名' }}</p>
                      <p class="text-white/60 text-sm">{{ userItem.email }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <UBadge
                    :color="userItem.role === 'ADMIN' ? 'red' : 'blue'"
                    variant="subtle"
                  >
                    {{ userItem.role === 'ADMIN' ? '管理员' : '普通用户' }}
                  </UBadge>
                </td>
                <td class="px-6 py-4">
                  <div class="flex gap-2">
                    <span v-if="hasPassword(userItem)" class="text-white/60 text-sm" title="密码登录">
                      📧
                    </span>
                    <span v-if="hasOAuth(userItem, 'github')" class="text-white/60 text-sm" title="GitHub">
                      🐙
                    </span>
                    <span v-if="hasOAuth(userItem, 'google')" class="text-white/60 text-sm" title="Google">
                      🔵
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-white/60 text-sm">
                    <span>{{ userItem._count?.posts || 0 }} 帖子</span>
                    <span class="mx-2">|</span>
                    <span>{{ userItem._count?.todos || 0 }} 待办</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span class="text-white/60 text-sm">{{ formatDate(userItem.createdAt) }}</span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex justify-end gap-2">
                    <UButton
                      size="sm"
                      :color="userItem.role === 'ADMIN' ? 'blue' : 'red'"
                      variant="outline"
                      @click="toggleRole(userItem)"
                    >
                      {{ userItem.role === 'ADMIN' ? '移除管理员' : '设为管理员' }}
                    </UButton>
                    <UButton
                      size="sm"
                      color="error"
                      variant="outline"
                      :loading="deletingUserId === userItem.id"
                      @click="confirmDelete(userItem)"
                    >
                      删除
                    </UButton>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Empty State -->
          <div v-if="users.length === 0" class="p-8 text-center">
            <p class="text-white/60">暂无用户</p>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.totalPages > 1" class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div class="flex items-center justify-between">
            <p class="text-white/60 text-sm">
              第 {{ pagination.page }} 页，共 {{ pagination.totalPages }} 页，{{ pagination.total }} 个用户
            </p>
            <div class="flex gap-2">
              <UButton
                color="white"
                variant="outline"
                :disabled="pagination.page <= 1"
                @click="changePage(pagination.page - 1)"
              >
                上一页
              </UButton>
              <UButton
                color="white"
                variant="outline"
                :disabled="pagination.page >= pagination.totalPages"
                @click="changePage(pagination.page + 1)"
              >
                下一页
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface UserItem {
  id: number
  email: string
  name?: string | null
  avatar?: string | null
  role: string
  createdAt: string
  updatedAt: string
  accounts: Array<{ id: number; provider: string }>
  _count?: {
    posts: number
    todos: number
  }
}

const users = ref<UserItem[]>([])
const loading = ref(true)
const deletingUserId = ref<number | null>(null)

const searchQuery = ref('')
const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 0,
})

// 检查是否有密码
function hasPassword(user: UserItem) {
  return user.accounts?.some((a: any) => !a.provider) ?? false
}

// 检查是否有 OAuth
function hasOAuth(user: UserItem, provider: string) {
  return user.accounts?.some((a: any) => a.provider === provider) ?? false
}

// 格式化日期
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString('zh-CN')
}

// 加载用户列表
async function loadUsers() {
  loading.value = true
  try {
    const query: any = {
      page: pagination.value.page,
      pageSize: pagination.value.pageSize,
    }
    if (searchQuery.value) {
      query.search = searchQuery.value
    }

    const data = await $fetch('/api/admin/users', { query })
    users.value = data.users
    pagination.value = data.pagination
  } catch (e: any) {
    console.error('Failed to load users:', e)
  } finally {
    loading.value = false
  }
}

// 搜索
function handleSearch() {
  pagination.value.page = 1
  loadUsers()
}

// 重置搜索
function resetSearch() {
  searchQuery.value = ''
  pagination.value.page = 1
  loadUsers()
}

// 切换角色
async function toggleRole(user: UserItem) {
  const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN'
  try {
    await $fetch(`/api/admin/users/${user.id}`, {
      method: 'PATCH',
      body: { role: newRole },
    })
    await loadUsers()
  } catch (e: any) {
    alert(e.data?.message || '操作失败')
  }
}

// 确认删除
async function confirmDelete(user: UserItem) {
  if (!confirm(`确定要删除用户 "${user.email}" 吗？此操作不可恢复。`)) {
    return
  }

  deletingUserId.value = user.id
  try {
    await $fetch(`/api/admin/users/${user.id}`, {
      method: 'DELETE',
    })
    await loadUsers()
  } catch (e: any) {
    alert(e.data?.message || '删除失败')
  } finally {
    deletingUserId.value = null
  }
}

// 切换页码
function changePage(page: number) {
  pagination.value.page = page
  loadUsers()
}

onMounted(() => {
  loadUsers()
})
</script>
