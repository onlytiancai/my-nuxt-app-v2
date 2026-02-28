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
      <div v-if="!ready" class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
        <div class="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto"></div>
        <p class="text-white/80 mt-4">加载中...</p>
      </div>

      <!-- Connected Accounts Card -->
      <div v-else class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
        <h2 class="text-xl font-bold text-white mb-6">已连接的登录方式</h2>

        <div class="space-y-4">
          <!-- Email/Password -->
          <div class="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p class="text-white font-medium">邮箱密码</p>
                <p class="text-white/60 text-sm">{{ user?.email }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <UBadge
                :color="hasPassword ? 'success' : 'warning'"
                variant="subtle"
              >
                {{ hasPassword ? '已设置' : '未设置' }}
              </UBadge>
              <UButton
                v-if="hasPassword"
                size="sm"
                color="white"
                variant="outline"
                @click="showPasswordModal = true"
              >
                修改密码
              </UButton>
              <UButton
                v-else
                size="sm"
                color="white"
                variant="outline"
                @click="showSetPassword = true"
              >
                设置密码
              </UButton>
            </div>
          </div>

          <!-- GitHub -->
          <div class="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-gray-700/20 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </div>
              <div>
                <p class="text-white font-medium">GitHub</p>
                <p class="text-white/60 text-sm">
                  {{ isGithubConnected ? '已连接' : '未连接' }}
                </p>
              </div>
            </div>
            <UButton
              v-if="isGithubConnected"
              size="sm"
              color="error"
              variant="outline"
              :loading="unlinkLoading === 'github'"
              @click="handleUnlink('github')"
            >
              断开连接
            </UButton>
            <UButton
              v-else
              size="sm"
              color="white"
              variant="outline"
              icon="i-logos-github-icon"
              @click="oauthLink('github')"
            >
              连接
            </UButton>
          </div>

          <!-- Google -->
          <div class="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </div>
              <div>
                <p class="text-white font-medium">Google</p>
                <p class="text-white/60 text-sm">
                  {{ isGoogleConnected ? '已连接' : '未连接' }}
                </p>
              </div>
            </div>
            <UButton
              v-if="isGoogleConnected"
              size="sm"
              color="error"
              variant="outline"
              :loading="unlinkLoading === 'google'"
              @click="handleUnlink('google')"
            >
              断开连接
            </UButton>
            <UButton
              v-else
              size="sm"
              color="white"
              variant="outline"
              icon="i-logos-google-icon"
              @click="oauthLink('google')"
            >
              连接
            </UButton>
          </div>
        </div>

        <!-- Set Password Modal -->
        <UModal v-model:open="showSetPassword" title="设置密码" description="为您的账户设置一个新密码">
          <template #body>
            <UForm :state="passwordForm" @submit.prevent="handleSetPassword" class="space-y-4">
              <UFormField label="新密码" name="newPassword">
                <UInput
                  v-model="passwordForm.newPassword"
                  type="password"
                  placeholder="至少 6 个字符"
                />
              </UFormField>

              <UFormField label="确认密码" name="confirmPassword">
                <UInput
                  v-model="passwordForm.confirmPassword"
                  type="password"
                  placeholder="再次输入密码"
                />
              </UFormField>

              <UAlert
                v-if="passwordError"
                color="error"
                variant="subtle"
                :title="passwordError"
              />

              <div class="flex gap-3 pt-4">
                <UButton type="submit" :loading="passwordLoading">
                  设置密码
                </UButton>
                <UButton color="neutral" variant="outline" @click="showSetPassword = false">
                  取消
                </UButton>
              </div>
            </UForm>
          </template>
        </UModal>

        <!-- Change Password Modal -->
        <UModal v-model:open="showPasswordModal" title="修改密码" description="请输入当前密码和新密码来更新您的密码">
          <template #body>
            <UForm :state="passwordForm" @submit.prevent="handleChangePassword" class="space-y-4">
              <UFormField label="当前密码" name="currentPassword">
                <UInput
                  v-model="passwordForm.currentPassword"
                  type="password"
                  placeholder="输入当前密码"
                />
              </UFormField>

              <UFormField label="新密码" name="newPassword">
                <UInput
                  v-model="passwordForm.newPassword"
                  type="password"
                  placeholder="至少 6 个字符"
                />
              </UFormField>

              <UFormField label="确认新密码" name="confirmPassword">
                <UInput
                  v-model="passwordForm.confirmPassword"
                  type="password"
                  placeholder="再次输入新密码"
                />
              </UFormField>

              <UAlert
                v-if="passwordError"
                color="error"
                variant="subtle"
                :title="passwordError"
              />

              <div class="flex gap-3 pt-4">
                <UButton type="submit" :loading="passwordLoading">
                  修改密码
                </UButton>
                <UButton color="neutral" variant="outline" @click="showPasswordModal = false">
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
const { ready, loggedIn, user, session, fetch: fetchUserSession } = useUserSession()

const unlinkLoading = ref<'github' | 'google' | null>(null)
const showSetPassword = ref(false)
const showPasswordModal = ref(false)
const passwordLoading = ref(false)
const passwordError = ref('')

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

// 检查是否有密码
const hasPassword = computed(() => {
  return user.value?.hasPassword ?? false
})

// 检查 OAuth 连接状态
const isGithubConnected = computed(() => {
  return user.value?.accounts?.some((a: any) => a.provider === 'github') ?? false
})

const isGoogleConnected = computed(() => {
  return user.value?.accounts?.some((a: any) => a.provider === 'google') ?? false
})

// OAuth 连接
function oauthLink(provider: string) {
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
      fetchUserSession()
    }
  }, 500)
}

// 断开 OAuth 连接
async function handleUnlink(provider: string) {
  unlinkLoading.value = provider as 'github' | 'google'
  try {
    await $fetch('/api/auth/unlink', {
      method: 'POST',
      body: { provider },
    })
    await fetchUserSession()
  } catch (e: any) {
    passwordError.value = e.data?.message || '操作失败'
  } finally {
    unlinkLoading.value = null
  }
}

// 设置密码
async function handleSetPassword() {
  passwordError.value = ''

  if (passwordForm.newPassword.length < 6) {
    passwordError.value = '密码至少需要 6 个字符'
    return
  }

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordError.value = '两次输入的密码不一致'
    return
  }

  passwordLoading.value = true
  try {
    await $fetch('/api/auth/password', {
      method: 'POST',
      body: {
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      },
    })
    showSetPassword.value = false
    await fetchUserSession()
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
  } catch (e: any) {
    passwordError.value = e.data?.message || '设置失败'
  } finally {
    passwordLoading.value = false
  }
}

// 修改密码
async function handleChangePassword() {
  passwordError.value = ''

  if (passwordForm.newPassword.length < 6) {
    passwordError.value = '密码至少需要 6 个字符'
    return
  }

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordError.value = '两次输入的密码不一致'
    return
  }

  passwordLoading.value = true
  try {
    await $fetch('/api/auth/password', {
      method: 'POST',
      body: {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      },
    })
    showPasswordModal.value = false
    await fetchUserSession()
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
  } catch (e: any) {
    passwordError.value = e.data?.message || '修改失败'
  } finally {
    passwordLoading.value = false
  }
}

// 初始加载时获取用户会话
onMounted(() => {
  fetchUserSession()
})
</script>
