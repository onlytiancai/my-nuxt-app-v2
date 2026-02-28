<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
    <div class="text-center">
      <div class="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
      <p class="text-white text-lg">正在加载...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { ready, loggedIn, user, fetch: fetchUserSession } = useUserSession()

onMounted(async () => {
  await fetchUserSession()
})

// 监听登录状态，重定向到对应的 dashboard
watch([ready, loggedIn, user], () => {
  if (ready.value) {
    if (!loggedIn.value) {
      navigateTo('/login')
      return
    }

    // 根据角色重定向
    if (user.value?.role === 'ADMIN') {
      navigateTo('/dashboard/admin')
    } else {
      navigateTo('/dashboard/user')
    }
  }
}, { immediate: true })
</script>
