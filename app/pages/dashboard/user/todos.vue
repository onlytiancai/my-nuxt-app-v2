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

      <!-- Todos Management -->
      <div v-else class="space-y-6">
        <!-- Header -->
        <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h1 class="text-2xl font-bold text-white mb-4">待办事项</h1>

          <!-- Add Todo Form -->
          <div class="flex gap-3">
            <UInput
              v-model="newTodoTitle"
              placeholder="添加新的待办事项..."
              class="flex-1"
              @keyup.enter="addTodo"
            />
            <UButton color="white" @click="addTodo">
              添加
            </UButton>
          </div>

          <!-- Filter -->
          <div class="flex gap-2 mt-4">
            <UButton
              :color="filter === 'all' ? 'white' : 'white'"
              :variant="filter === 'all' ? 'solid' : 'outline'"
              @click="filter = 'all'"
            >
              全部
            </UButton>
            <UButton
              :color="filter === 'active' ? 'white' : 'white'"
              :variant="filter === 'active' ? 'solid' : 'outline'"
              @click="filter = 'active'"
            >
              进行中
            </UButton>
            <UButton
              :color="filter === 'completed' ? 'white' : 'white'"
              :variant="filter === 'completed' ? 'solid' : 'outline'"
              @click="filter = 'completed'"
            >
              已完成
            </UButton>
          </div>
        </div>

        <!-- Todos List -->
        <div class="space-y-3">
          <div
            v-for="todo in todos"
            :key="todo.id"
            class="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 flex items-center gap-4"
          >
            <UCheckbox
              :model-value="todo.completed"
              @update:model-value="toggleTodo(todo)"
              class="flex-shrink-0"
            />
            <div class="flex-1">
              <p :class="['text-white', todo.completed ? 'line-through text-white/60' : 'font-medium']">
                {{ todo.title }}
              </p>
              <div class="flex gap-4 text-white/60 text-sm mt-1">
                <span v-if="todo.dueDate">截止：{{ formatDate(todo.dueDate) }}</span>
                <span>创建于 {{ formatDate(todo.createdAt) }}</span>
              </div>
            </div>
            <UButton
              size="sm"
              color="error"
              variant="outline"
              :loading="deletingTodoId === todo.id"
              @click="deleteTodo(todo)"
            >
              删除
            </UButton>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="todos.length === 0" class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
          <p class="text-white/60">
            {{ filter === 'all' ? '暂无待办事项，添加一个开始吧！' : `暂无${filter === 'active' ? '进行中' : '已完成'}的待办事项` }}
          </p>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.totalPages > 1" class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div class="flex items-center justify-between">
            <p class="text-white/60 text-sm">
              第 {{ pagination.page }} 页，共 {{ pagination.totalPages }} 页，{{ pagination.total }} 个待办
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
interface TodoItem {
  id: number
  title: string
  completed: boolean
  createdAt: string
  updatedAt: string
  dueDate?: string | null
}

const todos = ref<TodoItem[]>([])
const loading = ref(true)
const deletingTodoId = ref<number | null>(null)
const newTodoTitle = ref('')

const filter = ref<'all' | 'active' | 'completed'>('all')
const pagination = ref({
  page: 1,
  pageSize: 20,
  total: 0,
  totalPages: 0,
})

// 格式化日期
function formatDate(dateString?: string | null) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleString('zh-CN')
}

// 加载 Todo 列表
async function loadTodos() {
  loading.value = true
  try {
    const query: any = {
      page: pagination.value.page,
      pageSize: pagination.value.pageSize,
    }
    if (filter.value !== 'all') {
      query.completed = filter.value === 'completed' ? 'true' : 'false'
    }

    const data = await $fetch('/api/user/todos', { query })
    todos.value = data.todos
    pagination.value = data.pagination
  } catch (e: any) {
    console.error('Failed to load todos:', e)
  } finally {
    loading.value = false
  }
}

// 添加 Todo
async function addTodo() {
  if (!newTodoTitle.value.trim()) {
    return
  }

  try {
    const newTodo = await $fetch('/api/user/todos', {
      method: 'POST',
      body: { title: newTodoTitle.value },
    })
    todos.value.unshift(newTodo)
    newTodoTitle.value = ''
  } catch (e: any) {
    alert(e.data?.message || '添加失败')
  }
}

// 切换完成状态
async function toggleTodo(todo: TodoItem) {
  try {
    const updatedTodo = await $fetch(`/api/user/todos/${todo.id}`, {
      method: 'PATCH',
      body: { completed: !todo.completed },
    })
    const index = todos.value.findIndex(t => t.id === todo.id)
    if (index !== -1) {
      todos.value[index] = updatedTodo
    }
  } catch (e: any) {
    alert(e.data?.message || '更新失败')
  }
}

// 删除 Todo
async function deleteTodo(todo: TodoItem) {
  deletingTodoId.value = todo.id
  try {
    await $fetch(`/api/user/todos/${todo.id}`, {
      method: 'DELETE',
    })
    todos.value = todos.value.filter(t => t.id !== todo.id)
  } catch (e: any) {
    alert(e.data?.message || '删除失败')
  } finally {
    deletingTodoId.value = null
  }
}

// 切换页码
function changePage(page: number) {
  pagination.value.page = page
  loadTodos()
}

// 监听过滤器变化
watch(filter, () => {
  pagination.value.page = 1
  loadTodos()
})

onMounted(() => {
  loadTodos()
})
</script>
