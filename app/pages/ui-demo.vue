<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <!-- Header -->
    <header class="mb-12 text-center">
      <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
        <UIcon name="i-lucide:palette" class="inline mr-3 text-indigo-500" />
        Nuxt UI 组件演示
      </h1>
      <p class="text-lg text-gray-600">探索 @nuxt/ui 提供的丰富组件</p>
    </header>

    <!-- Navigation Tabs -->
    <div class="mb-12">
      <UTabs v-model="activeTab" :items="tabItems" />
    </div>

    <!-- Overview -->
    <div v-if="activeTab === 'overviews'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <UCard v-for="(item, index) in overviewItems" :key="index" class="hover:shadow-lg transition-shadow">
        <div class="flex items-start space-x-4">
          <UBadge :color="item.color" class="shrink-0">
            <UIcon :name="item.icon" class="w-5 h-5" />
          </UBadge>
          <div>
            <h3 class="font-semibold text-lg mb-2">{{ item.title }}</h3>
            <p class="text-gray-600 text-sm">{{ item.description }}</p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Buttons -->
    <div v-if="activeTab === 'buttons'" class="space-y-8">
      <section>
        <h2 class="text-2xl font-bold mb-6 flex items-center">
          <UIcon name="i-lucide:hand" class="mr-2 text-indigo-500" />
          按钮组件
        </h2>
        <div class="bg-white rounded-xl shadow-sm p-6">
          <!-- Variants -->
          <div class="mb-8">
            <h3 class="font-semibold mb-4 text-gray-700">按钮变体</h3>
            <div class="flex flex-wrap gap-3">
              <UButton>默认</UButton>
              <UButton variant="secondary">Secondary</UButton>
              <UButton variant="outline">Outline</UButton>
              <UButton variant="ghost">Ghost</UButton>
              <UButton variant="link">Link</UButton>
            </div>
          </div>

          <!-- Colors -->
          <div class="mb-8">
            <h3 class="font-semibold mb-4 text-gray-700">颜色变体</h3>
            <div class="flex flex-wrap gap-3">
              <UButton color="primary">Primary</UButton>
              <UButton color="secondary">Secondary</UButton>
              <UButton color="warning">Warning</UButton>
              <UButton color="error">Error</UButton>
              <UButton color="success">Success</UButton>
              <UButton color="info">Info</UButton>
            </div>
          </div>

          <!-- With Icons -->
          <div class="mb-8">
            <h3 class="font-semibold mb-4 text-gray-700">带图标的按钮</h3>
            <div class="flex flex-wrap gap-3">
              <UButton>
                <UIcon name="i-lucide:plus" class="mr-2" />
                添加
              </UButton>
              <UButton>
                编辑
                <UIcon name="i-lucide:pencil" class="ml-2" />
              </UButton>
              <UButton color="primary">
                <UIcon name="i-lucide:save" />
              </UButton>
              <UButton color="error" variant="outline">
                <UIcon name="i-lucide:trash-2" />
                删除
              </UButton>
            </div>
          </div>

          <!-- Sizes -->
          <div>
            <h3 class="font-semibold mb-4 text-gray-700">按钮尺寸</h3>
            <div class="flex items-center gap-3">
              <UButton size="xs">XS</UButton>
              <UButton size="sm">Small</UButton>
              <UButton>Default</UButton>
              <UButton size="lg">Large</UButton>
            </div>
          </div>
        </div>
      </section>

      <!-- Badge -->
      <section>
        <h2 class="text-2xl font-bold mb-6 flex items-center">
          <UIcon name="i-lucide:badge" class="mr-2 text-indigo-500" />
          徽章组件
        </h2>
        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex flex-wrap gap-4 items-center">
            <UBadge>默认徽章</UBadge>
            <UBadge color="primary">Primary</UBadge>
            <UBadge color="success" variant="soft">Success</UBadge>
            <UBadge color="warning" variant="soft">Warning</UBadge>
            <UBadge color="error" variant="soft">Error</UBadge>
            <UBadge circle>5</UBadge>
            <UBadge :dot="true">带指引点</UBadge>
          </div>
        </div>
      </section>
    </div>

    <!-- Forms -->
    <div v-if="activeTab === 'forms'" class="space-y-8">
      <section>
        <h2 class="text-2xl font-bold mb-6 flex items-center">
          <UIcon name="i-lucide:form" class="mr-2 text-indigo-500" />
          表单组件
        </h2>
        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Input -->
            <div>
              <label class="block mb-2 text-sm font-medium text-gray-700">输入框</label>
              <UInput v-model="form.input" placeholder="请输入内容" />
            </div>

            <!-- Select -->
            <div>
              <label class="block mb-2 text-sm font-medium text-gray-700">选择器</label>
              <USelect v-model="form.select" :options="selectOptions" placeholder="请选择" />
            </div>

            <!-- Checkbox -->
            <div class="md:col-span-2">
              <label class="block mb-2 text-sm font-medium text-gray-700">复选框</label>
              <div class="flex flex-wrap items-center gap-6">
                <UCheckbox v-model="form.checkbox1" label="选项 1" />
                <UCheckbox v-model="form.checkbox2" label="选项 2" />
                <UCheckbox v-model="form.checkbox3" label="禁用选项" disabled />
              </div>
            </div>

            <!-- Radio -->
            <div class="md:col-span-2">
              <label class="block mb-2 text-sm font-medium text-gray-700">单选框</label>
              <URadioGroup v-model="form.radio" :items="radioOptions" class="flex flex-wrap gap-6" />
            </div>

            <!-- Textarea -->
            <div class="md:col-span-2">
              <label class="block mb-2 text-sm font-medium text-gray-700">文本域</label>
              <UTextarea v-model="form.textarea" placeholder="请输入详细描述" :rows="3" />
            </div>

            <!-- Switch -->
            <div class="md:col-span-2">
              <label class="block mb-2 text-sm font-medium text-gray-700">开关</label>
              <div class="flex flex-wrap items-center gap-6">
                <USwitch v-model="form.switch1" label="启用功能" />
                <USwitch v-model="form.switch2" label="禁用状态" disabled />
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="mt-6 pt-6 border-t">
            <UButton @click="submitForm" color="primary" class="w-full md:w-auto">
              <UIcon name="i-lucide:check-circle" class="mr-2" />
              提交表单
            </UButton>
          </div>
        </div>
      </section>
    </div>

    <!-- Feedback -->
    <div v-if="activeTab === 'feedback'" class="space-y-8">
      <!-- Alert -->
      <section>
        <h2 class="text-2xl font-bold mb-6 flex items-center">
          <UIcon name="i-lucide:bell" class="mr-2 text-indigo-500" />
          通知反馈
        </h2>
        <div class="space-y-4">
          <UAlert icon="i-lucide:check-circle" color="success">
            这是一条成功的消息！操作已成功完成。
          </UAlert>
          <UAlert icon="i-lucide:info" color="info">
            这是一条提示信息，请注意查看。
          </UAlert>
          <UAlert icon="i-lucide:alert-triangle" color="warning">
            这是一条警告信息，请注意。
          </UAlert>
          <UAlert icon="i-lucide:x-circle" color="error">
            这是一条错误消息，操作失败了。
          </UAlert>
          <UAlert type="success" color="success" class="!border-l-4 !border-l-green-500">
            <div class="flex items-start">
              <UIcon name="i-lucide:check-circle" class="mr-3 mt-0.5" />
              <div>
                <h4 class="font-semibold">操作成功</h4>
                <p class="text-sm mt-1">数据已成功保存到服务器。</p>
              </div>
            </div>
          </UAlert>
        </div>
      </section>

      <!-- Skeleton -->
      <section>
        <h2 class="text-2xl font-bold mb-6 flex items-center">
          <UIcon name="i-lucide:loader" class="mr-2 text-indigo-500" />
          加载状态
        </h2>
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h3 class="font-semibold mb-4">Skeleton 骨架屏</h3>
          <div class="space-y-4">
            <div class="flex items-center space-x-4">
              <USkeleton class="w-12 h-12 rounded-full" />
              <div class="flex-1 space-y-2">
                <USkeleton class="h-4 w-1/3" />
                <USkeleton class="h-3 w-1/2" />
              </div>
            </div>
            <USkeleton class="h-32 w-full rounded-lg" />
          </div>
        </div>
      </section>
    </div>

    <!-- Navigation -->
    <div v-if="activeTab === 'navigation'" class="space-y-8">
      <!-- Breadcrumb -->
      <section>
        <h2 class="text-2xl font-bold mb-6 flex items-center">
          <UIcon name="i-lucide:route" class="mr-2 text-indigo-500" />
          面包屑导航
        </h2>
        <div class="bg-white rounded-xl shadow-sm p-6">
          <UBreadcrumb :items="breadcrumbItems" separator="/" />
        </div>
      </section>

      <!-- Pagination -->
      <section>
        <h2 class="text-2xl font-bold mb-6 flex items-center">
          <UIcon name="i-lucide:chevrons-up" class="mr-2 text-indigo-500" />
          分页组件
        </h2>
        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="mb-4">
            <p class="text-sm text-gray-600 mb-2">当前页: {{ pagination.page }}，每页: {{ pagination.itemsPerPage }}</p>
            <UPagination v-model:page="pagination.page" :items-per-page="pagination.itemsPerPage" :total="100" />
          </div>
        </div>
      </section>
    </div>

    <!-- Displays -->
    <div v-if="activeTab === 'displays'" class="space-y-8">
      <!-- Avatar -->
      <section>
        <h2 class="text-2xl font-bold mb-6 flex items-center">
          <UIcon name="i-lucide:user-circle" class="mr-2 text-indigo-500" />
          头像组件
        </h2>
        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex flex-wrap items-center gap-6">
            <UAvatar src="https://i.pravatar.cc/100?img=1" alt="User" />
            <UAvatar icon="i-lucide:user" />
            <UAvatar name="John Doe" />
            <UAvatarGroup>
              <UAvatar src="https://i.pravatar.cc/100?img=1" class="ring-2 ring-white" />
              <UAvatar src="https://i.pravatar.cc/100?img=2" class="ring-2 ring-white -ml-4" />
              <UAvatar src="https://i.pravatar.cc/100?img=3" class="ring-2 ring-white -ml-4" />
              <UAvatar>+3</UAvatar>
            </UAvatarGroup>
          </div>
        </div>
      </section>

      <!-- Divider -->
      <section>
        <h2 class="text-2xl font-bold mb-6 flex items-center">
          <UIcon name="i-lucide:minus" class="mr-2 text-indigo-500" />
          分割线
        </h2>
        <div class="bg-white rounded-xl shadow-sm p-6">
          <p>这是分割线上方的内容</p>
          <USeparator class="my-4" />
          <p>这是分割线下方的内容</p>
          <USeparator class="my-4" />
          <div class="flex items-center gap-4 text-sm text-gray-500">
            <span>左侧</span>
            <USeparator orientation="vertical" class="h-6" />
            <span>右侧</span>
          </div>
        </div>
      </section>

      <!-- Tooltip -->
      <section>
        <h2 class="text-2xl font-bold mb-6 flex items-center">
          <UIcon name="i-lucide:help-circle" class="mr-2 text-indigo-500" />
          工具提示
        </h2>
        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex flex-wrap gap-4">
            <UTooltip text="工具提示内容">
              <UButton variant="outline">
                <UIcon name="i-lucide:help-circle" />
              </UButton>
            </UTooltip>
            <UTooltip text="热门操作" side="top">
              <UButton>悬停查看</UButton>
            </UTooltip>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('overviews')

const tabItems = [
  { value: 'overviews', label: '概览' },
  { value: 'buttons', label: '按钮' },
  { value: 'forms', label: '表单' },
  { value: 'feedback', label: '反馈' },
  { value: 'navigation', label: '导航' },
  { value: 'displays', label: '显示' }
]

const overviewItems = [
  { title: '按钮组件', description: '丰富的按钮样式和颜色选择', icon: 'i-lucide:square-function', color: 'blue' },
  { title: '表单元素', description: '输入框、选择器、复选框等', icon: 'i-lucide:form', color: 'green' },
  { title: '数据展示', description: '头像、表格、卡片等展示组件', icon: 'i-lucide:layout-grid', color: 'purple' },
  { title: '导航组件', description: '面包屑、分页、标签页等', icon: 'i-lucide:navigation', color: 'orange' },
  { title: '反馈组件', description: '警告框、进度条、提示等', icon: 'i-lucide:bell', color: 'red' },
  { title: '布局组件', description: '容器、分隔线、间距等', icon: 'i-lucide:layout-grid', color: 'teal' }
]

const form = ref({
  input: '',
  select: null,
  checkbox1: false,
  checkbox2: true,
  checkbox3: false,
  radio: 'option1',
  textarea: '',
  switch1: true,
  switch2: false
})

const selectOptions = [
  { label: '选项 1', value: 'option1' },
  { label: '选项 2', value: 'option2' },
  { label: '选项 3', value: 'option3' }
]

const radioOptions = [
  { label: '选项 1', value: 'option1' },
  { label: '选项 2', value: 'option2' },
  { label: '选项 3', value: 'option3' }
]

const breadcrumbItems = [
  { label: '首页', to: '/' },
  { label: 'UI 演示' },
  { label: '当前页面', active: true }
]

const pagination = ref({
  page: 1,
  itemsPerPage: 10
})

function submitForm() {
  console.log('Form submitted:', form.value)
  alert('表单已提交！请查看控制台输出')
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
