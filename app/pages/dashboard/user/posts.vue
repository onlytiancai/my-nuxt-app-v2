<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Back to User Dashboard -->
      <NuxtLink
        to="/dashboard/user"
        class="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        返回用户后台
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
          <h1 class="text-2xl font-bold text-white mb-4">我的帖子</h1>

          <!-- Add Post Form -->
          <div class="space-y-3">
            <UInput
              v-model="newPostTitle"
              placeholder="帖子标题..."
            />
            <UTextarea
              v-model="newPostContent"
              placeholder="帖子内容..."
              :rows="3"
            />
            <div class="flex items-center gap-3">
              <UCheckbox
                v-model="newPostPublished"
                label="立即发布"
              />
              <UButton color="white" @click="addPost">
                创建帖子
              </UButton>
            </div>
          </div>

          <!-- Filter -->
          <div class="flex gap-2 mt-4">
            <UButton
              :variant="filter === 'all' ? 'solid' : 'outline'"
              color="white"
              @click="filter = 'all'"
            >
              全部
            </UButton>
            <UButton
              :variant="filter === 'published' ? 'solid' : 'outline'"
              color="white"
              @click="filter = 'published'"
            >
              已发布
            </UButton>
            <UButton
              :variant="filter === 'draft' ? 'solid' : 'outline'"
              color="white"
              @click="filter = 'draft'"
            >
              草稿
            </UButton>
          </div>
        </div>

        <!-- Posts List -->
        <div class="space-y-4">
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
                    {{ post.published ? '已发布' : '草稿' }}
                  </UBadge>
                </div>
                <p class="text-white/60 text-sm mb-3 line-clamp-2">{{ post.content || '无内容' }}</p>
                <div class="flex items-center gap-4 text-white/60 text-sm">
                  <span>创建于 {{ formatDate(post.createdAt) }}</span>
                  <span v-if="post.updatedAt !== post.createdAt">• 更新于 {{ formatDate(post.updatedAt) }}</span>
                </div>
              </div>
              <div class="flex flex-col gap-2">
                <UButton
                  size="sm"
                  color="white"
                  variant="outline"
                  @click="editPost(post)"
                >
                  编辑
                </UButton>
                <UButton
                  size="sm"
                  color="error"
                  variant="outline"
                  :loading="deletingPostId === post.id"
                  @click="deletePost(post)"
                >
                  删除
                </UButton>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="posts.length === 0" class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
          <p class="text-white/60">
            {{ filter === 'all' ? '暂无帖子，创建一个开始吧！' : `暂无${filter === 'published' ? '已发布' : '草稿'}的帖子` }}
          </p>
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

        <!-- Edit Post Modal -->
        <UModal v-model:open="showEditModal" title="编辑帖子">
          <template #body>
            <UForm :state="editForm" @submit.prevent="saveEdit" class="space-y-4">
              <UFormField label="标题" name="title">
                <UInput v-model="editForm.title" />
              </UFormField>

              <UFormField label="内容" name="content">
                <UTextarea v-model="editForm.content" :rows="5" />
              </UFormField>

              <UFormField name="published">
                <UCheckbox v-model="editForm.published" label="已发布" />
              </UFormField>

              <div class="flex gap-3 pt-4">
                <UButton type="submit" :loading="savingEdit">
                  保存
                </UButton>
                <UButton color="neutral" variant="outline" @click="showEditModal = false">
                  取消
                </UButton>
              </div>
            </UForm>
          </template>
        </UModal>
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
}

const posts = ref<PostItem[]>([])
const loading = ref(true)
const deletingPostId = ref<number | null>(null)

const newPostTitle = ref('')
const newPostContent = ref('')
const newPostPublished = ref(false)

const filter = ref<'all' | 'published' | 'draft'>('all')
const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 0,
})

const showEditModal = ref(false)
const savingEdit = ref(false)
const editForm = reactive({
  id: 0,
  title: '',
  content: '',
  published: false,
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
    if (filter.value !== 'all') {
      query.published = filter.value === 'published' ? 'true' : 'false'
    }

    const data = await $fetch('/api/user/posts', { query })
    posts.value = data.posts
    pagination.value = data.pagination
  } catch (e: any) {
    console.error('Failed to load posts:', e)
  } finally {
    loading.value = false
  }
}

// 添加帖子
async function addPost() {
  if (!newPostTitle.value.trim()) {
    alert('标题不能为空')
    return
  }

  try {
    const newPost = await $fetch('/api/user/posts', {
      method: 'POST',
      body: {
        title: newPostTitle.value,
        content: newPostContent.value,
        published: newPostPublished.value,
      },
    })
    posts.value.unshift(newPost)
    newPostTitle.value = ''
    newPostContent.value = ''
    newPostPublished.value = false
  } catch (e: any) {
    alert(e.data?.message || '创建失败')
  }
}

// 编辑帖子
function editPost(post: PostItem) {
  editForm.id = post.id
  editForm.title = post.title
  editForm.content = post.content || ''
  editForm.published = post.published
  showEditModal.value = true
}

// 保存编辑
async function saveEdit() {
  if (!editForm.title.trim()) {
    alert('标题不能为空')
    return
  }

  savingEdit.value = true
  try {
    const updatedPost = await $fetch(`/api/user/posts/${editForm.id}`, {
      method: 'PATCH',
      body: {
        title: editForm.title,
        content: editForm.content,
        published: editForm.published,
      },
    })
    const index = posts.value.findIndex(p => p.id === editForm.id)
    if (index !== -1) {
      posts.value[index] = updatedPost
    }
    showEditModal.value = false
  } catch (e: any) {
    alert(e.data?.message || '保存失败')
  } finally {
    savingEdit.value = false
  }
}

// 删除帖子
async function deletePost(post: PostItem) {
  deletingPostId.value = post.id
  try {
    await $fetch(`/api/user/posts/${post.id}`, {
      method: 'DELETE',
    })
    posts.value = posts.filter(p => p.id !== post.id)
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

// 监听过滤器变化
watch(filter, () => {
  pagination.value.page = 1
  loadPosts()
})

onMounted(() => {
  loadPosts()
})
</script>
