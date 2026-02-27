<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
    <div class="max-w-md w-full">
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

      <!-- Login Card -->
      <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-white mb-2">欢迎回来</h1>
          <p class="text-white/80">登录到您的账户</p>
        </div>

        <!-- OAuth Buttons -->
        <div class="space-y-3 mb-6">
          <UButton
            color="white"
            variant="solid"
            block
            size="lg"
            icon="i-logos-github-icon"
            @click="oauthLogin('github')"
          >
            使用 GitHub 登录
          </UButton>
          <UButton
            color="white"
            variant="solid"
            block
            size="lg"
            icon="i-logos-google-icon"
            @click="oauthLogin('google')"
          >
            使用 Google 登录
          </UButton>
        </div>

        <!-- Divider -->
        <div class="relative mb-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-white/20"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 text-white/60">或使用邮箱登录</span>
          </div>
        </div>

        <!-- Login Form -->
        <UForm @submit="handleLogin" :state="form" class="space-y-4">
          <UFormField label="邮箱" name="email">
            <UInput
              v-model="form.email"
              type="email"
              placeholder="your@email.com"
              icon="i-lucide-at-sign"
              size="lg"
            />
          </UFormField>

          <UFormField label="密码" name="password">
            <UInput
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              icon="i-lucide-lock"
              size="lg"
              :trailing="showPassword"
              trailing-icon="i-lucide-eye-off"
              @click:trailing="showPassword = !showPassword"
            />
          </UFormField>

          <UAlert
            v-if="error"
            color="error"
            variant="subtle"
            :title="error"
            class="mt-4"
          />

          <UButton
            type="submit"
            block
            size="lg"
            :loading="loading"
          >
            登录
          </UButton>
        </UForm>

        <!-- Register Link -->
        <p class="text-center mt-6 text-white/80">
          还没有账户？
          <NuxtLink to="/register" class="text-white font-medium hover:underline">
            立即注册
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const form = reactive({
  email: '',
  password: '',
})

const showPassword = ref(false)
const loading = ref(false)
const error = ref('')
const { fetch: fetchUserSession } = useUserSession()

const router = useRouter()
const route = useRouter().currentRoute

// OAuth 登录
function oauthLogin(provider: string) {
  // 在新窗口打开 OAuth 授权页
  const popupWidth = 500
  const popupHeight = 700
  const left = window.screenX + (window.outerWidth - popupWidth) / 2
  const top = window.screenY + (window.outerHeight - popupHeight) / 2

  const popup = window.open(
    `/auth/${provider}`,
    'oauth-popup',
    `width=${popupWidth},height=${popupHeight},left=${left},top=${top}`
  )

  // 监听 popup 关闭
  const checkPopupClosed = setInterval(() => {
    if (popup?.closed) {
      clearInterval(checkPopupClosed)
      // 刷新会话
      fetchUserSession().then(() => {
        router.push('/dashboard')
      })
    }
  }, 500)
}

// 表单登录
async function handleLogin() {
  loading.value = true
  error.value = ''

  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: form,
    })

    // 刷新会话
    await fetchUserSession()

    // 跳转到 dashboard
    router.push('/dashboard')
  } catch (e: any) {
    error.value = e.data?.message || '登录失败，请检查邮箱和密码'
  } finally {
    loading.value = false
  }
}
</script>
