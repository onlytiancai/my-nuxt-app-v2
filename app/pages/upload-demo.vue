<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation Bar -->
    <nav class="bg-white shadow-md sticky top-0 z-50">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-indigo-600 flex items-center gap-2">
          <UIcon name="i-lucide:upload-cloud" class="w-8 h-8" />
          文件上传演示
        </h1>
        <NuxtLink to="/" class="text-gray-600 hover:text-indigo-600 transition-colors">
          返回首页
        </NuxtLink>
      </div>
    </nav>

    <div class="max-w-4xl mx-auto px-4 py-8">
      <!-- Header -->
      <header class="mb-8 text-center pt-4">
        <h2 class="text-3xl font-bold text-gray-900 mb-2">
          <UIcon name="i-lucide:upload-cloud" class="inline mr-3 text-indigo-500" />
          文件上传 Demo
        </h2>
        <p class="text-gray-600">支持本地存储和 S3/MinIO 存储</p>
      </header>

      <!-- Upload Mode Tabs -->
      <div class="mb-6">
        <UTabs v-model="uploadMode" :items="modeItems" />
      </div>

      <!-- Upload Area -->
      <UCard class="mb-6">
        <div class="space-y-4">
          <!-- Drop Zone -->
          <div
            class="border-2 border-dashed rounded-xl p-8 text-center transition-colors"
            :class="isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleDrop"
          >
            <input
              ref="fileInput"
              type="file"
              multiple
              class="hidden"
              @change="handleFileSelect"
            />

            <UIcon
              name="i-lucide:cloud-upload"
              class="w-16 h-16 mx-auto mb-4 text-gray-400"
            />
            <p class="text-lg font-medium text-gray-700 mb-2">
              拖拽文件到此处上传
            </p>
            <p class="text-sm text-gray-500 mb-4">
              或点击选择文件
            </p>
            <UButton @click="triggerFileInput" color="primary">
              <UIcon name="i-lucide:folder-open" class="mr-2" />
              选择文件
            </UButton>
          </div>

          <!-- File List -->
          <div v-if="files.length > 0" class="space-y-2">
            <h3 class="font-semibold text-gray-700">已选择文件 ({{ files.length }})</h3>
            <div v-for="(file, index) in files" :key="index" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div class="flex items-center space-x-3 flex-1 min-w-0">
                <UIcon :name="getFileIcon(file.type)" class="w-8 h-8 text-gray-500 flex-shrink-0" />
                <div class="flex-1 min-w-0">
                  <p class="font-medium text-sm text-gray-900 truncate">{{ file.name }}</p>
                  <p class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</p>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <UButton
                  v-if="!file.uploading && !file.error"
                  @click="removeFile(index)"
                  variant="ghost"
                  color="error"
                  size="sm"
                >
                  <UIcon name="i-lucide:x" />
                </UButton>
              </div>
            </div>
          </div>

          <!-- Upload Button -->
          <div class="flex justify-center">
            <UButton
              @click="uploadFiles"
              :loading="isUploading"
              :disabled="files.length === 0 || canUploadFiles.length === 0"
              color="primary"
              size="lg"
              class="w-full md:w-auto"
            >
              <UIcon name="i-lucide:upload" class="mr-2" />
              {{ isUploading ? '上传中...' : `开始上传 (${canUploadFiles.length} 个文件)` }}
            </UButton>
          </div>
        </div>
      </UCard>

      <!-- Config Alert -->
      <UAlert
        v-if="uploadMode === 's3' && !s3Configured"
        icon="i-lucide:alert-triangle"
        color="warning"
        title="S3 配置未完成"
        description="请在 .env 文件中配置 S3/MinIO 相关环境变量，当前将使用演示模式"
        class="mb-6"
      />

      <!-- Upload History -->
      <UCard v-if="uploadHistory.length > 0">
        <template #header>
          <h3 class="font-semibold text-gray-700 flex items-center">
            <UIcon name="i-lucide:history" class="mr-2" />
            上传历史
          </h3>
        </template>
        <div class="space-y-3">
          <div
            v-for="(record, index) in uploadHistory"
            :key="index"
            class="p-3 bg-gray-50 rounded-lg"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs text-gray-500">{{ record.time }}</span>
              <UBadge :color="record.success ? 'success' : 'error'" size="sm">
                {{ record.success ? '成功' : '失败' }}
              </UBadge>
            </div>
            <p class="text-sm text-gray-700">{{ record.message }}</p>
            <div v-if="record.files?.length" class="mt-2 space-y-1">
              <a
                v-for="file in record.files"
                :key="file.url"
                :href="file.url"
                target="_blank"
                class="block text-xs text-indigo-600 hover:underline"
              >
                <UIcon name="i-lucide:external-link" class="inline mr-1" />
                {{ file.name }}
              </a>
            </div>
          </div>
        </div>
      </UCard>

      <!-- S3 Config Guide -->
      <UCard v-if="uploadMode === 's3'" class="mt-6">
        <template #header>
          <h3 class="font-semibold text-gray-700 flex items-center">
            <UIcon name="i-lucide:settings" class="mr-2" />
            S3/MinIO 配置指南
          </h3>
        </template>
        <div class="space-y-4">
          <p class="text-sm text-gray-600">
            在 <code class="px-2 py-1 bg-gray-100 rounded text-xs">.env</code> 文件中添加以下配置：
          </p>
          <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm"><code># MinIO 配置示例
NUXT_S3_ENDPOINT=http://localhost:9000
NUXT_S3_ACCESS_KEY=minioadmin
NUXT_S3_SECRET_KEY=minioadmin
NUXT_S3_BUCKET=uploads
NUXT_S3_REGION=us-east-1

# AWS S3 配置示例
# NUXT_S3_ENDPOINT=https://s3.amazonaws.com
# NUXT_S3_ACCESS_KEY=your-access-key
# NUXT_S3_SECRET_KEY=your-secret-key
# NUXT_S3_BUCKET=your-bucket-name
# NUXT_S3_REGION=us-east-1</code></pre>
          <UAlert
            icon="i-lucide:info"
            color="info"
            title="使用 Docker 快速启动 MinIO"
            class="mt-4"
          >
            <template #description>
              <pre class="text-xs mt-2"><code>docker run -p 9000:9000 -p 9001:9001 \
  -e "MINIO_ROOT_USER=minioadmin" \
  -e "MINIO_ROOT_PASSWORD=minioadmin" \
  minio/minio server /data --console-address ":9001"</code></pre>
            </template>
          </UAlert>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 上传模式：'local' 或 's3'
const uploadMode = ref('local')

const modeItems = [
  { value: 'local', label: '本地存储' },
  { value: 's3', label: 'S3/MinIO' }
]

const isDragging = ref(false)
const isUploading = ref(false)
const fileInput = ref(null)
const fileObjects = ref([]) // 存储实际的文件对象
const files = ref([]) // 存储文件元数据
const uploadHistory = ref([])

// S3 配置状态（实际项目中可以从 API 获取）
const s3Configured = false

const canUploadFiles = computed(() => {
  return files.value.filter(f => !f.uploading && !f.error)
})

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileSelect(event) {
  const selectedFiles = Array.from(event.target.files)
  addFiles(selectedFiles)
  event.target.value = '' // 重置 input
}

function handleDrop(event) {
  isDragging.value = false
  const droppedFiles = Array.from(event.dataTransfer.files)
  addFiles(droppedFiles)
}

function addFiles(newFiles) {
  for (const file of newFiles) {
    fileObjects.value.push(file)
    files.value.push({
      name: file.name,
      size: file.size,
      type: file.type,
      uploading: false,
      error: false,
      progress: 0
    })
  }
}

function removeFile(index) {
  files.value.splice(index, 1)
  fileObjects.value.splice(index, 1)
}

function getFileIcon(type) {
  if (!type) return 'i-lucide:file'
  if (type.startsWith('image/')) return 'i-lucide:image'
  if (type.startsWith('video/')) return 'i-lucide:video'
  if (type.startsWith('audio/')) return 'i-lucide:music'
  if (type.includes('pdf')) return 'i-lucide:file-text'
  if (type.includes('zip') || type.includes('rar')) return 'i-lucide:file-archive'
  if (type.includes('word')) return 'i-lucide:file-word'
  if (type.includes('excel') || type.includes('spreadsheet')) return 'i-lucide:file-spreadsheet'
  return 'i-lucide:file'
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

async function uploadFiles() {
  if (canUploadFiles.value.length === 0) return

  isUploading.value = true

  // 获取待上传的文件索引
  const uploadIndices = files.value
    .map((f, i) => (!f.uploading && !f.error) ? i : -1)
    .filter(i => i !== -1)

  // 标记为上传中
  uploadIndices.forEach(i => {
    files.value[i].uploading = true
  })

  const formData = new FormData()
  uploadIndices.forEach(i => {
    formData.append('files', fileObjects.value[i])
  })

  try {
    const endpoint = uploadMode.value === 's3' ? '/api/upload-s3' : '/api/upload'
    const response = await $fetch(endpoint, {
      method: 'POST',
      body: formData
    })

    const timestamp = new Date().toLocaleString('zh-CN')

    if (response.success) {
      // 更新文件状态
      uploadIndices.forEach(i => {
        files.value[i].uploading = false
        const uploadedFile = response.files.find(rf => rf.name === files.value[i].name)
        if (uploadedFile) {
          files.value[i].url = uploadedFile.url
        }
      })

      uploadHistory.value.unshift({
        time: timestamp,
        success: true,
        message: response.message,
        files: response.files
      })

      // 清空已上传的文件
      files.value = files.value.filter(f => f.uploading)
      fileObjects.value = fileObjects.value.filter((_, i) => !uploadIndices.includes(i))
    } else {
      throw new Error(response.message || '上传失败')
    }
  } catch (error) {
    console.error('Upload error:', error)

    uploadIndices.forEach(i => {
      files.value[i].uploading = false
      files.value[i].error = true
    })

    uploadHistory.value.unshift({
      time: new Date().toLocaleString('zh-CN'),
      success: false,
      message: error.message || '上传失败，请重试'
    })
  } finally {
    isUploading.value = false
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
