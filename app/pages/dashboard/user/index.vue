<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-8 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- Back to Home -->
      <NuxtLink
        to="/"
        class="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        返回首页
      </NuxtLink>

      <!-- Loading State -->
      <div v-if="!ready" class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
        <div class="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto"></div>
        <p class="text-white/80 mt-4">加载中...</p>
      </div>

      <!-- Not Logged In -->
      <div v-else-if="!loggedIn" class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
        <h1 class="text-3xl font-bold text-white mb-4">未登录</h1>
        <p class="text-white/80 mb-6">请先登录以访问您的账户</p>
        <UButton to="/login" size="lg" color="white">
          去登录
        </UButton>
      </div>

      <!-- User Dashboard -->
      <div v-else class="space-y-6">
        <!-- Header -->
        <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <UAvatar
                :src="user?.avatar"
                :alt="user?.name"
                size="3xl"
                class="bg-white/20"
              />
              <div>
                <h1 class="text-3xl font-bold text-white mb-1">
                  欢迎，{{ user?.name || '用户' }}
                </h1>
                <p class="text-white/80">{{ user?.email }}</p>
              </div>
            </div>
            <UButton
              color="white"
              variant="outline"
              icon="i-lucide-log-out"
              :loading="logoutLoading"
              @click="handleLogout"
            >
              退出登录
            </UButton>
          </div>
        </div>

        <!-- Navigation Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <NuxtLink
            to="/dashboard/user/profile"
            class="group bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all"
          >
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-bold text-white">个人资料</h3>
                <p class="text-white/60 text-sm">编辑个人信息</p>
              </div>
            </div>
          </NuxtLink>

          <NuxtLink
            to="/dashboard/user/todos"
            class="group bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all"
          >
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-bold text-white">待办事项</h3>
                <p class="text-white/60 text-sm">管理 Todo 列表</p>
              </div>
            </div>
          </NuxtLink>

          <NuxtLink
            to="/dashboard/user/posts"
            class="group bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all"
          >
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-bold text-white">我的帖子</h3>
                <p class="text-white/60 text-sm">管理 Post 列表</p>
              </div>
            </div>
          </NuxtLink>

          <NuxtLink
            to="/dashboard/user/connections"
            class="group bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all"
          >
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-bold text-white">登录方式</h3>
                <p class="text-white/60 text-sm">管理 OAuth 连接</p>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { ready, loggedIn, user, fetch: fetchUserSession, clear: clearSession } = useUserSession()

const logoutLoading = ref(false)

// 退出登录
async function handleLogout() {
  logoutLoading.value = true
  try {
    await $fetch('/api/auth/logout', { method: 'POST' })
    await clearSession()
    navigateTo('/')
  } catch (e) {
    console.error('Logout failed:', e)
  } finally {
    logoutLoading.value = false
  }
}

// 初始加载时获取用户会话
onMounted(() => {
  fetchUserSession()
})
</script>
