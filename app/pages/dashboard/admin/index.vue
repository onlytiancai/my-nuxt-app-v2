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

      <!-- Admin Dashboard -->
      <div v-else class="space-y-6">
        <!-- Header -->
        <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-white mb-2">
                管理后台
              </h1>
              <p class="text-white/80">欢迎，{{ user?.name || user?.email }}</p>
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
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <NuxtLink
            to="/dashboard/admin/users"
            class="group bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all"
          >
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <svg class="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-bold text-white group-hover:text-white/90">用户管理</h3>
                <p class="text-white/60 text-sm mt-1">管理所有用户账户</p>
              </div>
            </div>
          </NuxtLink>

          <NuxtLink
            to="/dashboard/admin/posts"
            class="group bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all"
          >
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 bg-green-500/20 rounded-xl flex items-center justify-center">
                <svg class="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-bold text-white group-hover:text-white/90">帖子管理</h3>
                <p class="text-white/60 text-sm mt-1">管理所有帖子内容</p>
              </div>
            </div>
          </NuxtLink>

          <NuxtLink
            to="/dashboard/user/profile"
            class="group bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all"
          >
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <svg class="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-bold text-white group-hover:text-white/90">个人设置</h3>
                <p class="text-white/60 text-sm mt-1">修改个人资料</p>
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
