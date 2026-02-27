<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation Bar -->
    <nav class="bg-white shadow-md sticky top-0 z-50">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-indigo-600 flex items-center gap-2">
          <UIcon name="i-lucide:database" class="w-8 h-8" />
          数据库操作演示
        </h1>
        <NuxtLink to="/" class="text-gray-600 hover:text-indigo-600 transition-colors">
          返回首页
        </NuxtLink>
      </div>
    </nav>

    <div class="max-w-6xl mx-auto px-4 py-8">
      <!-- Header -->
      <header class="mb-12 text-center pt-8">
        <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          <UIcon name="i-lucide:database" class="inline mr-3 text-indigo-500" />
          Prisma 数据库操作
        </h2>
        <p class="text-lg text-gray-600">学习如何使用 Prisma 进行数据库 CRUD 操作</p>
      </header>

      <!-- Navigation Tabs -->
      <div class="mb-12">
        <UTabs v-model="activeTab" :items="tabItems" />
      </div>

      <!-- User Management -->
      <div v-if="activeTab === 'users'" class="space-y-8">
        <!-- Create User -->
        <section>
          <h2 class="text-2xl font-bold mb-6 flex items-center">
            <UIcon name="i-lucide:user-plus" class="mr-2 text-indigo-500" />
            创建用户
          </h2>
          <UCard>
            <form @submit.prevent="createUser" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">用户名</label>
                <UInput v-model="userForm.name" placeholder="请输入用户名" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
                <UInput v-model="userForm.email" type="email" placeholder="请输入邮箱" />
              </div>
              <UButton type="submit" color="primary" :loading="loading">
                <UIcon name="i-lucide:plus" class="mr-2" />
                创建用户
              </UButton>
            </form>
          </UCard>
        </section>

        <!-- User List -->
        <section>
          <h2 class="text-2xl font-bold mb-6 flex items-center">
            <UIcon name="i-lucide:users" class="mr-2 text-indigo-500" />
            用户列表
          </h2>
          <UCard>
            <div class="mb-4 flex justify-between items-center">
              <p class="text-sm text-gray-600">
                共 {{ users?.length || 0 }} 个用户
              </p>
              <UButton variant="outline" size="sm" @click="refreshUsers" :loading="loading">
                <UIcon name="i-lucide:refresh-cw" class="mr-2" />
                刷新
              </UButton>
            </div>

            <UTable v-if="users?.length" :columns="userColumns" :data="users" />
            <UAlert v-else icon="i-lucide:info" color="info">
              暂无用户数据，请在上方创建用户
            </UAlert>
          </UCard>
        </section>
      </div>

      <!-- Post Management -->
      <div v-if="activeTab === 'posts'" class="space-y-8">
        <!-- Create Post -->
        <section>
          <h2 class="text-2xl font-bold mb-6 flex items-center">
            <UIcon name="i-lucide:file-plus" class="mr-2 text-indigo-500" />
            创建文章
          </h2>
          <UCard>
            <form @submit.prevent="createPost" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">标题</label>
                <UInput v-model="postForm.title" placeholder="请输入文章标题" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">作者</label>
                <USelectMenu v-model="postForm.authorId" :items="userSelectOptions" placeholder="请选择作者" :content="{ side: 'bottom', sideOffset: 8, collisionPadding: 8, modal: false, trapFocus: false }" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">内容</label>
                <UTextarea v-model="postForm.content" :rows="4" placeholder="请输入文章内容" />
              </div>
              <div class="flex items-center gap-2">
                <UCheckbox v-model="postForm.published" />
                <label class="text-sm text-gray-700">立即发布</label>
              </div>
              <UButton type="submit" color="primary" :loading="loading">
                <UIcon name="i-lucide:plus" class="mr-2" />
                创建文章
              </UButton>
            </form>
          </UCard>
        </section>

        <!-- Post List -->
        <section>
          <h2 class="text-2xl font-bold mb-6 flex items-center">
            <UIcon name="i-lucide:file-text" class="mr-2 text-indigo-500" />
            文章列表
          </h2>
          <UCard>
            <div class="mb-4 flex justify-between items-center">
              <p class="text-sm text-gray-600">
                共 {{ posts?.length || 0 }} 篇文章
              </p>
              <UButton variant="outline" size="sm" @click="refreshPosts" :loading="loading">
                <UIcon name="i-lucide:refresh-cw" class="mr-2" />
                刷新
              </UButton>
            </div>

            <UTable v-if="posts?.length" :columns="postColumns" :data="posts" />
            <UAlert v-else icon="i-lucide:info" color="info">
              暂无文章数据，请在上方创建文章
            </UAlert>
          </UCard>
        </section>
      </div>

      <!-- API Documentation -->
      <div v-if="activeTab === 'raw-sql'" class="space-y-8">
        <section>
          <h2 class="text-2xl font-bold mb-6 flex items-center">
            <UIcon name="i-lucide:code" class="mr-2 text-indigo-500" />
            API 端点说明
          </h2>
          <UCard>
            <div class="space-y-4">
              <div>
                <h3 class="font-semibold mb-2 flex items-center">
                  <UIcon name="i-lucide:users" class="mr-2 text-blue-500" />
                  用户相关 API
                </h3>
                <div class="bg-gray-100 rounded-lg p-4 space-y-2">
                  <div class="flex items-center gap-2">
                    <UBadge color="green">GET</UBadge>
                    <code class="text-sm">/api/users</code>
                    <span class="text-gray-600 text-sm">- 获取所有用户</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <UBadge color="blue">POST</UBadge>
                    <code class="text-sm">/api/users</code>
                    <span class="text-gray-600 text-sm">- 创建新用户</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 class="font-semibold mb-2 flex items-center">
                  <UIcon name="i-lucide:file-text" class="mr-2 text-purple-500" />
                  文章相关 API
                </h3>
                <div class="bg-gray-100 rounded-lg p-4 space-y-2">
                  <div class="flex items-center gap-2">
                    <UBadge color="green">GET</UBadge>
                    <code class="text-sm">/api/posts</code>
                    <span class="text-gray-600 text-sm">- 获取所有文章</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <UBadge color="blue">POST</UBadge>
                    <code class="text-sm">/api/posts</code>
                    <span class="text-gray-600 text-sm">- 创建新文章</span>
                  </div>
                </div>
              </div>

              <UAlert icon="i-lucide:lightbulb" color="info" title="提示">
                本演示使用 Prisma ORM 操作 SQLite 数据库，数据存储在本地文件中。
              </UAlert>
            </div>
          </UCard>
        </section>

        <!-- Schema -->
        <section>
          <h2 class="text-2xl font-bold mb-6 flex items-center">
            <UIcon name="i-lucide:table" class="mr-2 text-indigo-500" />
            数据库结构
          </h2>
          <UCard>
            <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm"><code>// User 模型
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  posts Post[]
}

// Post 模型
model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User?    @relation(fields: [authorId], references: [id])
  authorId  Int?
}</code></pre>
          </UCard>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeTab = ref('users')
const loading = ref(false)
const toast = useToast()

const tabItems = [
  { value: 'users', label: '用户管理' },
  { value: 'posts', label: '文章管理' },
  { value: 'raw-sql', label: 'API 说明' }
]

// User form state
const userForm = ref({
  name: '',
  email: ''
})

// Post form state
const postForm = ref({
  title: '',
  authorId: null,
  content: '',
  published: false
})

// Fetch users
const { data: users, refresh: refreshUsers } = await useFetch('/api/users', {
  lazy: true
})

// Fetch posts
const { data: posts, refresh: refreshPosts } = await useFetch('/api/posts', {
  lazy: true
})

// User table columns
const userColumns = computed(() => [
  {
    accessorKey: 'id',
    header: 'ID',
    size: 80
  },
  {
    accessorKey: 'name',
    header: '用户名'
  },
  {
    accessorKey: 'email',
    header: '邮箱'
  },
  {
    accessorKey: 'posts',
    header: '文章数',
    size: 80,
    cell: ({ getValue }) => {
      const posts = getValue()
      return Array.isArray(posts) ? posts.length : 0
    }
  }
])

// Post table columns
const postColumns = computed(() => [
  {
    accessorKey: 'id',
    header: 'ID',
    size: 80
  },
  {
    accessorKey: 'title',
    header: '标题'
  },
  {
    accessorKey: 'published',
    header: '状态',
    size: 80,
    cell: ({ getValue }) => {
      return getValue()
        ? h('span', { class: 'text-green-600 flex items-center gap-1' }, [
            h(UIcon, { name: 'i-lucide:check-circle', class: 'w-4 h-4' }),
            '已发布'
          ])
        : h('span', { class: 'text-gray-400 flex items-center gap-1' }, [
            h(UIcon, { name: 'i-lucide:clock', class: 'w-4 h-4' }),
            '草稿'
          ])
    }
  },
  {
    accessorKey: 'author',
    header: '作者',
    size: 120,
    cell: ({ getValue }) => {
      const author = getValue()
      return author?.name || '未命名'
    }
  }
])

// User select options for post form
const userSelectOptions = computed(() => {
  if (!users.value) return []
  return users.value.map(user => ({
    label: user.name || '未命名',
    value: user.id
  }))
})

// Create user
async function createUser() {
  if (!userForm.value.name || !userForm.value.email) {
    toast.add({
      title: '验证失败',
      description: '请填写用户名和邮箱',
      color: 'error'
    })
    return
  }

  loading.value = true
  try {
    await $fetch('/api/users', {
      method: 'POST',
      body: userForm.value
    })

    toast.add({
      title: '创建成功',
      description: `用户 ${userForm.value.name} 已创建`,
      color: 'success'
    })

    userForm.value = { name: '', email: '' }
    await refreshUsers()
  } catch (error) {
    toast.add({
      title: '创建失败',
      description: error.message,
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}

// Create post
async function createPost() {
  if (!postForm.value.title || !postForm.value.authorId) {
    toast.add({
      title: '验证失败',
      description: '请填写标题和选择作者',
      color: 'error'
    })
    return
  }

  loading.value = true
  try {
    await $fetch('/api/posts', {
      method: 'POST',
      body: postForm.value
    })

    toast.add({
      title: '创建成功',
      description: `文章 "${postForm.value.title}" 已创建`,
      color: 'success'
    })

    postForm.value = { title: '', authorId: null, content: '', published: false }
    await refreshPosts()
  } catch (error) {
    toast.add({
      title: '创建失败',
      description: error.message,
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
:deep(.ui-tabs-content) {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
