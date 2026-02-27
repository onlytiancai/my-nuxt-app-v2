<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation Bar -->
    <nav class="bg-white shadow-md sticky top-0 z-50">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-indigo-600">Tailwind CSS 演示</h1>
        <NuxtLink to="/" class="text-gray-600 hover:text-indigo-600 transition-colors">
          返回首页
        </NuxtLink>
      </div>
    </nav>

    <div class="container mx-auto px-4 py-8">
      <!-- Typography -->
      <section class="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-6 flex items-center">
          <span class="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center mr-3">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </span>
          排版样式
        </h2>
        <div class="space-y-4">
          <h1 class="text-4xl font-bold text-gray-900">Heading 1 - 标题一</h1>
          <h2 class="text-3xl font-bold text-gray-800">Heading 2 - 标题二</h2>
          <h3 class="text-2xl font-semibold text-gray-700">Heading 3 - 标题三</h3>
          <p class="text-gray-600">这是一段普通文本，展示了 Tailwind CSS 的文本样式。</p>
          <p class="text-lg text-blue-600">这是带颜色的文本（蓝色）</p>
          <p class="text-sm text-gray-500">这是小号文本（灰色）</p>
        </div>
      </section>

      <!-- Colors -->
      <section class="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-6 flex items-center">
          <span class="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center mr-3">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
          </span>
          颜色调色板
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div class="space-y-2">
            <div class="h-16 rounded-lg bg-red-500 flex items-center justify-center text-white font-medium">Red 500</div>
            <div class="h-16 rounded-lg bg-red-400 flex items-center justify-center text-white font-medium">Red 400</div>
            <div class="h-16 rounded-lg bg-red-300 flex items-center justify-center text-gray-800 font-medium">Red 300</div>
          </div>
          <div class="space-y-2">
            <div class="h-16 rounded-lg bg-orange-500 flex items-center justify-center text-white font-medium">Orange 500</div>
            <div class="h-16 rounded-lg bg-orange-400 flex items-center justify-center text-white font-medium">Orange 400</div>
            <div class="h-16 rounded-lg bg-orange-300 flex items-center justify-center text-gray-800 font-medium">Orange 300</div>
          </div>
          <div class="space-y-2">
            <div class="h-16 rounded-lg bg-amber-500 flex items-center justify-center text-white font-medium">Amber 500</div>
            <div class="h-16 rounded-lg bg-amber-400 flex items-center justify-center text-white font-medium">Amber 400</div>
            <div class="h-16 rounded-lg bg-amber-300 flex items-center justify-center text-gray-800 font-medium">Amber 300</div>
          </div>
          <div class="space-y-2">
            <div class="h-16 rounded-lg bg-green-500 flex items-center justify-center text-white font-medium">Green 500</div>
            <div class="h-16 rounded-lg bg-green-400 flex items-center justify-center text-white font-medium">Green 400</div>
            <div class="h-16 rounded-lg bg-green-300 flex items-center justify-center text-gray-800 font-medium">Green 300</div>
          </div>
          <div class="space-y-2">
            <div class="h-16 rounded-lg bg-blue-500 flex items-center justify-center text-white font-medium">Blue 500</div>
            <div class="h-16 rounded-lg bg-blue-400 flex items-center justify-center text-white font-medium">Blue 400</div>
            <div class="h-16 rounded-lg bg-blue-300 flex items-center justify-center text-gray-800 font-medium">Blue 300</div>
          </div>
          <div class="space-y-2">
            <div class="h-16 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-medium">Indigo 500</div>
            <div class="h-16 rounded-lg bg-indigo-400 flex items-center justify-center text-white font-medium">Indigo 400</div>
            <div class="h-16 rounded-lg bg-indigo-300 flex items-center justify-center text-gray-800 font-medium">Indigo 300</div>
          </div>
          <div class="space-y-2">
            <div class="h-16 rounded-lg bg-purple-500 flex items-center justify-center text-white font-medium">Purple 500</div>
            <div class="h-16 rounded-lg bg-purple-400 flex items-center justify-center text-white font-medium">Purple 400</div>
            <div class="h-16 rounded-lg bg-purple-300 flex items-center justify-center text-gray-800 font-medium">Purple 300</div>
          </div>
          <div class="space-y-2">
            <div class="h-16 rounded-lg bg-pink-500 flex items-center justify-center text-white font-medium">Pink 500</div>
            <div class="h-16 rounded-lg bg-pink-400 flex items-center justify-center text-white font-medium">Pink 400</div>
            <div class="h-16 rounded-lg bg-pink-300 flex items-center justify-center text-gray-800 font-medium">Pink 300</div>
          </div>
          <div class="space-y-2">
            <div class="h-16 rounded-lg bg-cyan-500 flex items-center justify-center text-white font-medium">Cyan 500</div>
            <div class="h-16 rounded-lg bg-cyan-400 flex items-center justify-center text-white font-medium">Cyan 400</div>
            <div class="h-16 rounded-lg bg-cyan-300 flex items-center justify-center text-gray-800 font-medium">Cyan 300</div>
          </div>
          <div class="space-y-2">
            <div class="h-16 rounded-lg bg-teal-500 flex items-center justify-center text-white font-medium">Teal 500</div>
            <div class="h-16 rounded-lg bg-teal-400 flex items-center justify-center text-white font-medium">Teal 400</div>
            <div class="h-16 rounded-lg bg-teal-300 flex items-center justify-center text-gray-800 font-medium">Teal 300</div>
          </div>
        </div>
      </section>

      <!-- Buttons -->
      <section class="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-6 flex items-center">
          <span class="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
          </span>
          按钮样式
        </h2>
        <div class="flex flex-wrap gap-4">
          <button class="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
            主要按钮
          </button>
          <button class="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors">
            次要按钮
          </button>
          <button class="px-6 py-3 border-2 border-indigo-600 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition-colors">
            轮廓按钮
          </button>
          <button class="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl">
            渐变按钮
          </button>
          <button class="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-indigo-500 hover:text-indigo-500 transition-colors">
            幽灵按钮
          </button>
          <button disabled class="px-6 py-3 bg-gray-400 text-gray-200 font-semibold rounded-lg cursor-not-allowed">
            禁用按钮
          </button>
        </div>
      </section>

      <!-- Cards -->
      <section class="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-6 flex items-center">
          <span class="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center mr-3">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </span>
          卡片组件
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div class="text-4xl mb-4">🚀</div>
            <h3 class="text-xl font-bold mb-2">快速开发</h3>
            <p class="text-blue-100">使用实用类快速构建界面</p>
          </div>
          <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div class="text-4xl mb-4">🎨</div>
            <h3 class="text-xl font-bold mb-2">美观设计</h3>
            <p class="text-purple-100">内置丰富的颜色和样式</p>
          </div>
          <div class="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div class="text-4xl mb-4">📱</div>
            <h3 class="text-xl font-bold mb-2">响应式</h3>
            <p class="text-pink-100">移动端优先的设计理念</p>
          </div>
        </div>
      </section>

      <!-- Forms -->
      <section class="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-6 flex items-center">
          <span class="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center mr-3">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </span>
          表单元素
        </h2>
        <div class="space-y-4 max-w-md">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">邮箱地址</label>
            <input type="email" placeholder="your@email.com" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">密码</label>
            <input type="password" placeholder="••••••••" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">选择选项</label>
            <select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors">
              <option>选项一</option>
              <option>选项二</option>
              <option>选项三</option>
            </select>
          </div>
          <div class="flex items-center">
            <input type="checkbox" id="remember" class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
            <label for="remember" class="ml-2 text-sm text-gray-600">记住我</label>
          </div>
          <button class="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
            提交
          </button>
        </div>
      </section>

      <!-- Utilities -->
      <section class="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-6 flex items-center">
          <span class="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </span>
          工具类
        </h2>
        <div class="space-y-6">
          <div>
            <h3 class="text-lg font-semibold text-gray-700 mb-2">间距 (Margin/Padding)</h3>
            <div class="flex gap-4">
              <div class="w-20 h-20 bg-red-400 rounded flex items-center justify-center text-white text-xs">m-4</div>
              <div class="w-20 h-20 bg-orange-400 rounded flex items-center justify-center text-white text-xs">m-8</div>
              <div class="w-20 h-20 bg-yellow-400 rounded flex items-center justify-center text-white text-xs">m-12</div>
            </div>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-700 mb-2">圆角 (Border Radius)</h3>
            <div class="flex gap-4">
              <div class="w-20 h-20 bg-green-400 rounded-sm flex items-center justify-center text-white text-xs">rounded-sm</div>
              <div class="w-20 h-20 bg-green-400 rounded flex items-center justify-center text-white text-xs">rounded</div>
              <div class="w-20 h-20 bg-green-400 rounded-lg flex items-center justify-center text-white text-xs">rounded-lg</div>
              <div class="w-20 h-20 bg-green-400 rounded-xl flex items-center justify-center text-white text-xs">rounded-xl</div>
              <div class="w-20 h-20 bg-green-400 rounded-full flex items-center justify-center text-white text-xs">full</div>
            </div>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-700 mb-2">阴影 (Box Shadow)</h3>
            <div class="flex gap-4">
              <div class="w-20 h-20 bg-blue-400 shadow flex items-center justify-center text-white text-xs">shadow</div>
              <div class="w-20 h-20 bg-blue-400 shadow-md flex items-center justify-center text-white text-xs">shadow-md</div>
              <div class="w-20 h-20 bg-blue-400 shadow-lg flex items-center justify-center text-white text-xs">shadow-lg</div>
              <div class="w-20 h-20 bg-blue-400 shadow-xl flex items-center justify-center text-white text-xs">shadow-xl</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Grid & Flex -->
      <section class="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-6 flex items-center">
          <span class="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center mr-3">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
          </span>
          布局 (Grid & Flex)
        </h2>
        <div class="space-y-6">
          <div>
            <h3 class="text-lg font-semibold text-gray-700 mb-2">Flexbox 布局</h3>
            <div class="flex justify-between items-center bg-gray-100 rounded-lg p-4">
              <div class="w-12 h-12 bg-indigo-500 rounded flex items-center justify-center text-white">1</div>
              <div class="w-12 h-12 bg-purple-500 rounded flex items-center justify-center text-white">2</div>
              <div class="w-12 h-12 bg-pink-500 rounded flex items-center justify-center text-white">3</div>
            </div>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-700 mb-2">Grid 布局</h3>
            <div class="grid grid-cols-4 gap-4 bg-gray-100 rounded-lg p-4">
              <div class="h-16 bg-gradient-to-br from-indigo-400 to-indigo-500 rounded flex items-center justify-center text-white">1</div>
              <div class="h-16 bg-gradient-to-br from-purple-400 to-purple-500 rounded flex items-center justify-center text-white">2</div>
              <div class="h-16 bg-gradient-to-br from-pink-400 to-pink-500 rounded flex items-center justify-center text-white">3</div>
              <div class="h-16 bg-gradient-to-br from-red-400 to-red-500 rounded flex items-center justify-center text-white">4</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Animations -->
      <section class="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-6 flex items-center">
          <span class="w-8 h-8 bg-violet-500 rounded-lg flex items-center justify-center mr-3">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </span>
          动画效果
        </h2>
        <div class="flex flex-wrap gap-4">
          <div class="w-16 h-16 bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-lg animate-ping"></div>
          <div class="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg animate-pulse"></div>
          <div class="w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-lg animate-bounce"></div>
          <div class="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg animate-spin"></div>
          <button class="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-lg hover:scale-110 transition-transform">
            Hover 缩放
          </button>
          <button class="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-lg hover:rotate-12 transition-transform">
            Hover 旋转
          </button>
        </div>
      </section>
    </div>
  </div>
</template>
