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

      <!-- Posts Management -->
      <div v-else class="space-y-6">
        <!-- Header -->
        <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h1 class="text-2xl font-bold text-white mb-4">帖子管理</h1>

          <!-- Search Bar -->
          <div class="flex gap-3">
            <UInput
              v-model="searchQuery"
              placeholder="搜索帖子标题或内容..."
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

        <!-- Posts List -->
        <div class="grid gap-4">
          <div
            v-for="post in posts"
            :key="post.id"
            class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <h3 class="text-lg font-bold text-white">{{ post.title }}</h3>
                  <UBadge
                    :color="post.published ? 'green' : 'gray'"
                    variant="subtle"
                  >
                    {{ post.published ? '已发布' : '未发布' }}
                  </UBadge>
                </div>
                <p class="text-white/60 text-sm mb-3 line-clamp-2">{{ post.content || '无内容' }}</p>
                <div class="flex items-center gap-4 text-white/60 text-sm">
                  <span>作者：{{ post.author?.name || post.author?.email || '未知' }}</span>
                  <span>•</span>
                  <span>创建于 {{ formatDate(post.createdAt) }}</span>
                </div>
              </div>
              <div class="flex flex-col gap-2">
                <UButton
                  size="sm"
                  color="error"
                  variant="outline"
                  :loading="deletingPostId === post.id"
                  @click="confirmDelete(post)"
                >
                  删除
                </UButton>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="posts.length === 0" class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
          <p class="text-white/60">暂无帖子</p>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.totalPages > 1" class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div class="flex items-center justify-between">
            <p class="text-white/60 text-sm">
              第 {{ pagination.page }} 页，共 {{ pagination.totalPages }} 页，{{ pagination.total }} 个帖子
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
interface PostItem {
  id: number
  title: string
  content?: string | null
  published: boolean
  createdAt: string
  updatedAt: string
  author?: {
    id: number
    name?: string | null
    email?: string | null
  } | null
}

const posts = ref<PostItem[]>([])
const loading = ref(true)
const deletingPostId = ref<number | null>(null)

const searchQuery = ref('')
const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 0,
})

// 格式化日期
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString('zh-CN')
}

// 加载帖子列表
async function loadPosts() {
  loading.value = true
  try {
    const query: any = {
      page: pagination.value.page,
      pageSize: pagination.value.pageSize,
    }
    if (searchQuery.value) {
      query.search = searchQuery.value
    }

    const data = await $fetch('/api/admin/posts', { query })
    posts.value = data.posts
    pagination.value = data.pagination
  } catch (e: any) {
    console.error('Failed to load posts:', e)
  } finally {
    loading.value = false
  }
}

// 搜索
function handleSearch() {
  pagination.value.page = 1
  loadPosts()
}

// 重置搜索
function resetSearch() {
  searchQuery.value = ''
  pagination.value.page = 1
  loadPosts()
}

// 确认删除
async function confirmDelete(post: PostItem) {
  if (!confirm(`确定要删除帖子 "${post.title}" 吗？此操作不可恢复。`)) {
    return
  }

  deletingPostId.value = post.id
  try {
    // 使用用户 API 删除（需要是作者才能删除）
    // 管理员可以直接删除，这里简化处理，暂时不实现管理员直接删除
    alert('请联系帖子作者自行删除')
    // await $fetch(`/api/user/posts/${post.id}`, {
    //   method: 'DELETE',
    // })
    // await loadPosts()
  } catch (e: any) {
    alert(e.data?.message || '删除失败')
  } finally {
    deletingPostId.value = null
  }
}

// 切换页码
function changePage(page: number) {
  pagination.value.page = page
  loadPosts()
}

onMounted(() => {
  loadPosts()
})
</script>
