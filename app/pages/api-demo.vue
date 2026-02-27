<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
    <!-- Navigation Bar -->
    <nav class="bg-white/10 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-white flex items-center gap-2">
          <svg class="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          API 调用演示
        </h1>
        <NuxtLink to="/" class="text-white/80 hover:text-white transition-colors">
          返回首页
        </NuxtLink>
      </div>
    </nav>

    <div class="container mx-auto px-4 py-8">
      <!-- GET Request Demo -->
      <section class="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/10 p-8 mb-8">
        <h2 class="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <span class="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </span>
          GET 请求 - 获取问候语
        </h2>
        <div class="bg-black/30 rounded-lg p-4 mb-4 font-mono text-sm">
          <span class="text-green-400">GET</span>
          <span class="text-white ml-2">/api/greeting</span>
        </div>
        <button
          @click="fetchGreeting"
          :disabled="loading.greeting"
          class="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <svg v-if="loading.greeting" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ loading.greeting ? '请求中...' : '发送 GET 请求' }}
        </button>
        <div v-if="greeting" class="mt-4 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
          <div class="flex items-start gap-3">
            <span class="text-2xl">👋</span>
            <div>
              <p class="text-green-200 text-lg font-medium">{{ greeting.message }}</p>
              <p class="text-green-400/60 text-sm mt-1">{{ greeting.timestamp }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- POST Request Demo -->
      <section class="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/10 p-8 mb-8">
        <h2 class="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <span class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </span>
          POST 请求 - 提交数据
        </h2>
        <div class="bg-black/30 rounded-lg p-4 mb-4 font-mono text-sm">
          <span class="text-blue-400">POST</span>
          <span class="text-white ml-2">/api/submit</span>
        </div>
        <div class="space-y-4 mb-4 max-w-md">
          <div>
            <label class="block text-sm text-white/70 mb-2">姓名</label>
            <input
              v-model="formData.name"
              type="text"
              placeholder="请输入姓名"
              class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label class="block text-sm text-white/70 mb-2">邮箱</label>
            <input
              v-model="formData.email"
              type="email"
              placeholder="your@email.com"
              class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label class="block text-sm text-white/70 mb-2">留言</label>
            <textarea
              v-model="formData.message"
              placeholder="请输入留言内容..."
              rows="3"
              class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            ></textarea>
          </div>
        </div>
        <button
          @click="submitForm"
          :disabled="loading.submit"
          class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <svg v-if="loading.submit" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ loading.submit ? '提交中...' : '提交表单' }}
        </button>
        <div v-if="submitResult" class="mt-4 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
          <div class="flex items-start gap-3">
            <span class="text-2xl">✅</span>
            <div>
              <p class="text-blue-200 font-medium">提交成功！</p>
              <p class="text-blue-400/80 text-sm mt-1">服务器返回 ID: {{ submitResult.id }}</p>
            </div>
          </div>
        </div>
        <div v-if="submitError" class="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
          <p class="text-red-200">{{ submitError }}</p>
        </div>
      </section>

      <!-- User List Demo -->
      <section class="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/10 p-8 mb-8">
        <h2 class="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <span class="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </span>
          获取用户列表 - JSONPlaceholder
        </h2>
        <div class="bg-black/30 rounded-lg p-4 mb-4 font-mono text-sm">
          <span class="text-purple-400">GET</span>
          <span class="text-white ml-2">https://jsonplaceholder.typicode.com/users</span>
        </div>
        <button
          @click="fetchUsers"
          :disabled="loading.users"
          class="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <svg v-if="loading.users" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ loading.users ? '加载中...' : '获取用户列表' }}
        </button>
        <div v-if="users.length > 0" class="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="user in users"
            :key="user.id"
            class="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors"
          >
            <div class="flex items-center gap-3 mb-2">
              <div class="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                {{ user.name.charAt(0) }}
              </div>
              <div>
                <h3 class="text-white font-medium">{{ user.name }}</h3>
                <p class="text-white/50 text-sm">@{{ user.username }}</p>
              </div>
            </div>
            <div class="space-y-1 text-sm">
              <p class="text-white/70 flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {{ user.email }}
              </p>
              <p class="text-white/70 flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {{ user.phone }}
              </p>
              <p class="text-white/70 flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                {{ user.website }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Code Example -->
      <section class="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/10 p-8">
        <h2 class="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <span class="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </span>
          代码示例
        </h2>
        <pre class="bg-black/50 rounded-lg p-4 overflow-x-auto text-sm"><code class="language-vue text-gray-300"><span class="text-purple-400">&lt;script setup&gt;</span>
<span class="text-gray-500">// GET 请求</span>
<span class="text-purple-400">const</span> <span class="text-blue-400">fetchGreeting</span> = <span class="text-purple-400">async</span> () => {
  <span class="text-purple-400">const</span> response = <span class="text-purple-400">await</span> $<span class="text-blue-400">fetch</span>(<span class="text-green-400">'/api/greeting'</span>)
  greeting.value = response
}

<span class="text-gray-500">// POST 请求</span>
<span class="text-purple-400">const</span> <span class="text-blue-400">submitForm</span> = <span class="text-purple-400">async</span> () => {
  <span class="text-purple-400">const</span> response = <span class="text-purple-400">await</span> $<span class="text-blue-400">fetch</span>(<span class="text-green-400">'/api/submit'</span>, {
    method: <span class="text-green-400">'POST'</span>,
    body: formData.value
  })
  submitResult.value = response
}

<span class="text-gray-500">// 获取外部 API 数据</span>
<span class="text-purple-400">const</span> <span class="text-blue-400">fetchUsers</span> = <span class="text-purple-400">async</span> () => {
  users.value = <span class="text-purple-400">await</span> $<span class="text-blue-400">fetch</span>(<span class="text-green-400">'https://jsonplaceholder.typicode.com/users'</span>)
}
<span class="text-purple-400">&lt;/script&gt;</span></code></pre>
      </section>
    </div>
  </div>
</template>

<script setup>
// GET 请求示例
const greeting = ref(null)
const loading = ref({
  greeting: false,
  submit: false,
  users: false
})

const fetchGreeting = async () => {
  loading.value.greeting = true
  try {
    const response = await $fetch('/api/greeting')
    greeting.value = response
  } catch (error) {
    console.error('获取问候语失败:', error)
  } finally {
    loading.value.greeting = false
  }
}

// POST 请求示例
const formData = ref({
  name: '',
  email: '',
  message: ''
})
const submitResult = ref(null)
const submitError = ref(null)

const submitForm = async () => {
  loading.value.submit = true
  submitError.value = null
  submitResult.value = null

  try {
    const response = await $fetch('/api/submit', {
      method: 'POST',
      body: formData.value
    })
    submitResult.value = response
    // 清空表单
    formData.value = { name: '', email: '', message: '' }
  } catch (error) {
    submitError.value = error.data?.message || '提交失败，请重试'
  } finally {
    loading.value.submit = false
  }
}

// 获取用户列表
const users = ref([])

const fetchUsers = async () => {
  loading.value.users = true
  try {
    users.value = await $fetch('https://jsonplaceholder.typicode.com/users')
  } catch (error) {
    console.error('获取用户列表失败:', error)
  } finally {
    loading.value.users = false
  }
}
</script>
