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

      <!-- Register Card -->
      <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-white mb-2">创建账户</h1>
          <p class="text-white/80">注册一个新账户开始使用</p>
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
            使用 GitHub 注册
          </UButton>
          <UButton
            color="white"
            variant="solid"
            block
            size="lg"
            icon="i-logos-google-icon"
            @click="oauthLogin('google')"
          >
            使用 Google 注册
          </UButton>
        </div>

        <!-- Divider -->
        <div class="relative mb-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-white/20"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 text-white/60">或使用邮箱注册</span>
          </div>
        </div>

        <!-- Register Form -->
        <form @submit.prevent="handleRegister" class="space-y-4">
          <UFormField label="用户名">
            <UInput
              v-model="form.name"
              placeholder="您的用户名"
              icon="i-lucide-user"
              size="lg"
            />
          </UFormField>

          <UFormField label="邮箱">
            <UInput
              v-model="form.email"
              type="email"
              placeholder="your@email.com"
              icon="i-lucide-at-sign"
              size="lg"
            />
          </UFormField>

          <UFormField label="密码" :error="passwordError">
            <UInput
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="至少 6 个字符"
              icon="i-lucide-lock"
              size="lg"
              :trailing="showPassword"
              trailing-icon="i-lucide-eye-off"
              @click:trailing="showPassword = !showPassword"
            />
          </UFormField>

          <!-- Password Strength -->
          <div v-if="form.password" class="space-y-2">
            <UProgress
              :color="passwordStrengthColor"
              :model-value="passwordStrength"
              :max="4"
              size="sm"
            />
            <p class="text-xs text-white/60">
              密码强度：{{ passwordStrengthText }}
            </p>
          </div>

          <UFormField label="确认密码">
            <UInput
              v-model="form.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="再次输入密码"
              icon="i-lucide-lock-keyhole"
              size="lg"
              :trailing="showConfirmPassword"
              trailing-icon="i-lucide-eye-off"
              @click:trailing="showConfirmPassword = !showConfirmPassword"
            />
          </UFormField>

          <div class="flex items-start gap-2">
            <UCheckbox
              v-model="form.agree"
              color="primary"
            />
            <span class="text-sm text-white/80">
              我已阅读并同意
              <a href="#" class="text-white font-medium hover:underline">服务条款</a>
              和
              <a href="#" class="text-white font-medium hover:underline">隐私政策</a>
            </span>
          </div>

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
            创建账户
          </UButton>
        </form>

        <!-- Login Link -->
        <p class="text-center mt-6 text-white/80">
          已有账户？
          <NuxtLink to="/login" class="text-white font-medium hover:underline">
            立即登录
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  agree: false,
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
const error = ref('')
const passwordError = ref('')

const { fetch: fetchUserSession } = useUserSession()
const router = useRouter()

// 密码强度计算
const passwordStrength = computed(() => {
  const password = form.password
  if (!password) return 0

  let strength = 0
  if (password.length >= 8) strength++
  if (/[a-z]/.test(password)) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/\d/.test(password)) strength++
  if (/[^a-zA-Z0-9]/.test(password)) strength++

  return Math.min(strength, 4)
})

const passwordStrengthColor = computed(() => {
  const strength = passwordStrength.value
  if (strength === 0) return 'neutral'
  if (strength <= 1) return 'error'
  if (strength <= 2) return 'warning'
  if (strength === 3) return 'info'
  return 'success'
})

const passwordStrengthText = computed(() => {
  const strength = passwordStrength.value
  if (strength === 0) return '请输入密码'
  if (strength <= 1) return '非常弱'
  if (strength <= 2) return '较弱'
  if (strength === 3) return '中等'
  return '强'
})

// OAuth 登录
function oauthLogin(provider: string) {
  const popupWidth = 500
  const popupHeight = 700
  const left = window.screenX + (window.outerWidth - popupWidth) / 2
  const top = window.screenY + (window.outerHeight - popupHeight) / 2

  const popup = window.open(
    `/auth/${provider}`,
    'oauth-popup',
    `width=${popupWidth},height=${popupHeight},left=${left},top=${top}`
  )

  const checkPopupClosed = setInterval(() => {
    if (popup?.closed) {
      clearInterval(checkPopupClosed)
      fetchUserSession().then(() => {
        router.push('/dashboard')
      })
    }
  }, 500)
}

// 表单注册
async function handleRegister() {
  error.value = ''
  passwordError.value = ''

  // 验证
  if (!form.agree) {
    error.value = '请同意服务条款和隐私政策'
    return
  }

  if (form.password.length < 6) {
    passwordError.value = '密码至少需要 6 个字符'
    return
  }

  if (form.password !== form.confirmPassword) {
    error.value = '两次输入的密码不一致'
    return
  }

  loading.value = true

  try {
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: form,
    })

    // 刷新会话
    await fetchUserSession()

    // 跳转到 dashboard
    router.push('/dashboard')
  } catch (e: any) {
    error.value = e.data?.message || '注册失败，请稍后重试'
  } finally {
    loading.value = false
  }
}
</script>
