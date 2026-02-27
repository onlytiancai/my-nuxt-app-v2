<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation Bar -->
    <nav class="bg-white shadow-md sticky top-0 z-50">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-indigo-600">Icon 图标演示</h1>
        <NuxtLink to="/" class="text-gray-600 hover:text-indigo-600 transition-colors">
          返回首页
        </NuxtLink>
      </div>
    </nav>

    <div class="container mx-auto px-4 py-8">
      <!-- Introduction -->
      <section class="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-6 flex items-center">
          <span class="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center mr-3">
            <Icon name="mdi:information" class="w-5 h-5 text-white" />
          </span>
          关于 Nuxt Icon
        </h2>
        <div class="space-y-4 text-gray-600">
          <p>
            <strong>@nuxt/icon</strong> 是 Nuxt 官方维护的图标模块，基于
            <a href="https://icones.js.org/" target="_blank" class="text-indigo-600 hover:underline">
              Icos
            </a>
            和
            <a href="https://iconify.design/" target="_blank" class="text-indigo-600 hover:underline">
              Iconify
            </a>
            ，提供了超过 200,000 个开源图标的访问。
          </p>
          <p>
            主要特性：
          </p>
          <ul class="list-disc list-inside space-y-2 ml-4">
            <li>Nuxt 3 ready，完全支持 SSR</li>
            <li>支持 200,000+ 开源图标 via Iconify</li>
            <li>支持 CSS mode / SVG mode 两种渲染模式</li>
            <li>自定义 SVG 支持（通过 Vue 组件或本地 SVG 文件）</li>
            <li>按需加载，性能优化</li>
            <li>服务端打包（Server Bundle）支持</li>
            <li>客户端打包（Client Bundle）支持</li>
          </ul>
        </div>
      </section>

      <!-- Setup -->
      <section class="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-6 flex items-center">
          <span class="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center mr-3">
            <Icon name="mdi:setup" class="w-5 h-5 text-white" />
          </span>
          安装与配置
        </h2>

        <div class="space-y-6">
          <div>
            <h3 class="text-lg font-semibold text-gray-700 mb-3">安装模块</h3>
            <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
<code>npm add -D @nuxt/icon
# 或
pnpm add -D @nuxt/icon</code></pre>
          </div>

          <div>
            <h3 class="text-lg font-semibold text-gray-700 mb-3">配置 nuxt.config.ts</h3>
            <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
<code>export default defineNuxtConfig({
  modules: [
    '@nuxt/icon'
  ]
})</code></pre>
          </div>

          <div>
            <h3 class="text-lg font-semibold text-gray-700 mb-3">配置 app.config.ts</h3>
            <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
<code>export default defineAppConfig({
  icon: {
    size: '24px',
    class: 'icon',
    mode: 'css',
    aliases: {
      'nuxt': 'logos:nuxt-icon',
    },
    cssLayer: 'base'
  }
})</code></pre>
          </div>

          <div>
            <h3 class="text-lg font-semibold text-gray-700 mb-3">安装图标集合</h3>
            <p class="text-gray-600 mb-2">建议按需安装图标集合以优化性能：</p>
            <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
<code>pnpm add -D @iconify-json/mdi
pnpm add -D @iconify-json/uil
pnpm add -D @iconify-json/ph
pnpm add -D @iconify-json/fa</code></pre>
          </div>
        </div>
      </section>

      <!-- Basic Usage -->
      <section class="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-6 flex items-center">
          <span class="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center mr-3">
            <Icon name="mdi:code-tags" class="w-5 h-5 text-white" />
          </span>
          基础用法
        </h2>
        <div class="space-y-6">
          <div>
            <h3 class="text-lg font-semibold text-gray-700 mb-3">基本图标</h3>
            <div class="flex flex-wrap gap-6 items-center">
              <div class="flex items-center gap-2">
                <Icon name="mdi:heart" />
                <span class="text-gray-600 text-sm">mdi:heart</span>
              </div>
              <div class="flex items-center gap-2">
                <Icon name="mdi:star" />
                <span class="text-gray-600 text-sm">mdi:star</span>
              </div>
              <div class="flex items-center gap-2">
                <Icon name="mdi:home" />
                <span class="text-gray-600 text-sm">mdi:home</span>
              </div>
              <div class="flex items-center gap-2">
                <Icon name="mdi:menu" />
                <span class="text-gray-600 text-sm">mdi:menu</span>
              </div>
              <div class="flex items-center gap-2">
                <Icon name="uil:github" />
                <span class="text-gray-600 text-sm">uil:github</span>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-lg font-semibold text-gray-700 mb-3">Props 和 Attributes</h3>
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-gray-100">
                    <th class="px-4 py-2 border">属性</th>
                    <th class="px-4 py-2 border">类型</th>
                    <th class="px-4 py-2 border">默认值</th>
                    <th class="px-4 py-2 border">描述</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="px-4 py-2 border"><code>name</code></td>
                    <td class="px-4 py-2 border"><code>string</code></td>
                    <td class="px-4 py-2 border"><code>-</code></td>
                    <td class="px-4 py-2 border">图标名称（必需）</td>
                  </tr>
                  <tr>
                    <td class="px-4 py-2 border"><code>size</code></td>
                    <td class="px-4 py-2 border"><code>string | number</code></td>
                    <td class="px-4 py-2 border"><code>1em</code></td>
                    <td class="px-4 py-2 border">图标大小</td>
                  </tr>
                  <tr>
                    <td class="px-4 py-2 border"><code>mode</code></td>
                    <td class="px-4 py-2 border"><code>'svg' | 'css'</code></td>
                    <td class="px-4 py-2 border"><code>css</code></td>
                    <td class="px-4 py-2 border">渲染模式</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 class="text-lg font-semibold text-gray-700 mb-3">代码示例</h3>
            <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
<code>&lt;template&gt;
  &lt;!-- 基础使用 --&gt;
  &lt;Icon name="mdi:heart" /&gt;

  &lt;!-- 设置大小和颜色 --&gt;
  &lt;Icon name="mdi:star" size="32" class="text-yellow-500" /&gt;

  &lt;!-- CSS 模式 --&gt;
  &lt;Icon name="mdi:home" mode="css" /&gt;

  &lt;!-- SVG 模式 --&gt;
  &lt;Icon name="mdi:home" mode="svg" /&gt;

  &lt;!-- 内联样式 --&gt;
  &lt;Icon name="mdi:settings" style="color: #ff5733" /&gt;
&lt;/template&gt;</code></pre>
          </div>
        </div>
      </section>

      <!-- Size and Color -->
      <section class="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-6 flex items-center">
          <span class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
            <Icon name="mdi:pencil" class="w-5 h-5 text-white" />
          </span>
          大小与颜色
        </h2>
        <div class="space-y-8">
          <!-- Size Examples -->
          <div>
            <h3 class="text-lg font-semibold text-gray-700 mb-3">不同大小的图标</h3>
            <div class="flex flex-wrap items-center gap-8">
              <div class="flex flex-col items-center gap-2">
                <Icon name="mdi:coffee" size="24" />
                <span class="text-xs text-gray-500">size="24"</span>
              </div>
              <div class="flex flex-col items-center gap-2">
                <Icon name="mdi:coffee" size="32" />
                <span class="text-xs text-gray-500">size="32"</span>
              </div>
              <div class="flex flex-col items-center gap-2">
                <Icon name="mdi:coffee" size="48" />
                <span class="text-xs text-gray-500">size="48"</span>
              </div>
              <div class="flex flex-col items-center gap-2">
                <Icon name="mdi:coffee" size="64" />
                <span class="text-xs text-gray-500">size="64"</span>
              </div>
              <!-- Custom size with Tailwind -->
              <div class="flex flex-col items-center gap-2">
                <Icon name="mdi:coffee" class="w-16 h-16" />
                <span class="text-xs text-gray-500">class="w-16 h-16"</span>
              </div>
            </div>
          </div>

          <!-- Color Examples -->
          <div>
            <h3 class="text-lg font-semibold text-gray-700 mb-3">不同颜色的图标</h3>
            <div class="flex flex-wrap items-center gap-6">
              <div class="flex flex-col items-center gap-2">
                <Icon name="mdi:heart" class="text-red-500" />
                <span class="text-xs text-gray-500">text-red-500</span>
              </div>
              <div class="flex flex-col items-center gap-2">
                <Icon name="mdi:heart" class="text-pink-500" />
                <span class="text-xs text-gray-500">text-pink-500</span>
              </div>
              <div class="flex flex-col items-center gap-2">
                <Icon name="mdi:heart" class="text-rose-500" />
                <span class="text-xs text-gray-500">text-rose-500</span>
              </div>
              <div class="flex flex-col items-center gap-2">
                <Icon name="mdi:heart" class="text-red-600" />
                <span class="text-xs text-gray-500">text-red-600</span>
              </div>
              <div class="flex flex-col items-center gap-2">
                <Icon name="mdi:heart" class="text-red-700" />
                <span class="text-xs text-gray-500">text-red-700</span>
              </div>
            </div>
          </div>

          <!-- Size with Tailwind -->
          <div>
            <h3 class="text-lg font-semibold text-gray-700 mb-3">Tailwind CSS 尺寸类</h3>
            <div class="flex flex-wrap items-center gap-6">
              <div class="flex flex-col items-center gap-2">
                <Icon name="mdi:account" class="w-4 h-4" />
                <span class="text-xs text-gray-500">w-4 h-4</span>
              </div>
              <div class="flex flex-col items-center gap-2">
                <Icon name="mdi:account" class="w-6 h-6" />
                <span class="text-xs text-gray-500">w-6 h-6</span>
              </div>
              <div class="flex flex-col items-center gap-2">
                <Icon name="mdi:account" class="w-8 h-8" />
                <span class="text-xs text-gray-500">w-8 h-8</span>
              </div>
              <div class="flex flex-col items-center gap-2">
                <Icon name="mdi:account" class="w-12 h-12" />
                <span class="text-xs text-gray-500">w-12 h-12</span>
              </div>
              <div class="flex flex-col items-center gap-2">
                <Icon name="mdi:account" class="w-16 h-16" />
                <span class="text-xs text-gray-500">w-16 h-16</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Icon Collections -->
      <section class="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-6 flex items-center">
          <span class="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
            <Icon name="mdi:collection" class="w-5 h-5 text-white" />
          </span>
          图标集合
        </h2>
        <p class="text-gray-600 mb-6">
          Nuxt Icon 支持多个图标集合，以下是常用集合的示例：
        </p>

        <!-- MDI Collection -->
        <div class="mb-8">
          <h3 class="text-xl font-semibold text-gray-800 mb-4">
            <Icon name="mdi:information" class="inline w-5 h-5 mr-2 text-purple-600" />
            Material Design Icons (mdi:*)
          </h3>
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div v-for="icon in mdiIcons" :key="icon" class="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <Icon :name="`mdi:${icon}`" class="w-8 h-8 text-gray-700" />
              <span class="text-xs text-gray-600 font-mono">{{ icon }}</span>
            </div>
          </div>
        </div>

        <!-- UIM Collection -->
        <div class="mb-8">
          <h3 class="text-xl font-semibold text-gray-800 mb-4">
            <Icon name="uil:instagram" class="inline w-5 h-5 mr-2 text-pink-500" />
            Video Game UI Icons (uil:*)
          </h3>
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div v-for="icon in uilIcons" :key="icon" class="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <Icon :name="`uil:${icon}`" class="w-8 h-8 text-gray-700" />
              <span class="text-xs text-gray-600 font-mono">{{ icon }}</span>
            </div>
          </div>
        </div>

        <!-- Ph Collection -->
        <div class="mb-8">
          <h3 class="text-xl font-semibold text-gray-800 mb-4">
            <Icon name="ph:suitcase" class="inline w-5 h-5 mr-2 text-blue-600" />
            Phosphor Icons (ph:*)
          </h3>
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div v-for="icon in phIcons" :key="icon" class="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <Icon :name="`ph:${icon}`" class="w-8 h-8 text-gray-700" />
              <span class="text-xs text-gray-600 font-mono">{{ icon }}</span>
            </div>
          </div>
        </div>

        <!-- FontAwesome Collection -->
        <div>
          <h3 class="text-xl font-semibold text-gray-800 mb-4">
            <Icon name="fa:FontAwesome" class="inline w-5 h-5 mr-2 text-green-600" />
            Font Awesome (fa:*)
          </h3>
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div v-for="icon in faIcons" :key="icon" class="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <Icon :name="`fa:${icon}`" class="w-8 h-8 text-gray-700" />
              <span class="text-xs text-gray-600 font-mono">{{ icon }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Icon with Text -->
      <section class="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-6 flex items-center">
          <span class="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
            <Icon name="mdi:format-text" class="w-5 h-5 text-white" />
          </span>
          图标与文本
        </h2>
        <div class="space-y-6">
          <!-- Button with Icon -->
          <div>
            <h3 class="text-lg font-semibold text-gray-700 mb-3">带图标的按钮</h3>
            <div class="flex flex-wrap gap-4">
              <button class="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors">
                <Icon name="mdi:plus" size="20" />
                <span>添加</span>
              </button>
              <button class="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors">
                <Icon name="mdi:check" size="20" />
                <span>确认</span>
              </button>
              <button class="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center gap-2 hover:bg-red-700 transition-colors">
                <Icon name="mdi:delete" size="20" />
                <span>删除</span>
              </button>
              <button class="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors">
                <Icon name="mdi:settings" size="20" />
                <span>设置</span>
              </button>
              <button class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors">
                <Icon name="mdi:download" size="20" />
                <span>下载</span>
              </button>
              <button class="px-4 py-2 border-2 border-indigo-600 text-indigo-600 rounded-lg flex items-center gap-2 hover:bg-indigo-50 transition-colors">
                <Icon name="mdi:share" size="20" />
                <span>分享</span>
              </button>
            </div>
          </div>

          <!-- Nav with Icons -->
          <div>
            <h3 class="text-lg font-semibold text-gray-700 mb-3">带图标的导航菜单</h3>
            <div class="flex flex-col sm:flex-row gap-4">
              <NuxtLink
                to="/"
                class="flex items-center gap-3 px-4 py-3 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                <Icon name="mdi:home" size="20" />
                <span>首页</span>
              </NuxtLink>
              <NuxtLink
                to="/tailwind"
                class="flex items-center gap-3 px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Icon name="mdi:palette" size="20" />
                <span>Tailwind</span>
              </NuxtLink>
              <NuxtLink
                to="/api-demo"
                class="flex items-center gap-3 px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Icon name="mdi:code-tags" size="20" />
                <span>API</span>
              </NuxtLink>
              <NuxtLink
                to="/icon"
                class="flex items-center gap-3 px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Icon name="mdi:star" size="20" />
                <span>Icon</span>
              </NuxtLink>
            </div>
          </div>

          <!-- Social Links -->
          <div>
            <h3 class="text-lg font-semibold text-gray-700 mb-3">社交链接</h3>
            <div class="flex items-center gap-4">
              <a href="https://github.com" target="_blank" class="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <Icon name="bi:github" class="w-6 h-6 text-gray-700" />
              </a>
              <a href="https://twitter.com" target="_blank" class="p-3 bg-sky-100 rounded-lg hover:bg-sky-200 transition-colors">
                <Icon name="bi:twitter" class="w-6 h-6 text-sky-600" />
              </a>
              <a href="https://facebook.com" target="_blank" class="p-3 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors">
                <Icon name="bi:facebook" class="w-6 h-6 text-blue-600" />
              </a>
              <a href="https://instagram.com" target="_blank" class="p-3 bg-pink-100 rounded-lg hover:bg-pink-200 transition-colors">
                <Icon name="bi:instagram" class="w-6 h-6 text-pink-600" />
              </a>
              <a href="https://linkedin.com" target="_blank" class="p-3 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors">
                <Icon name="bi:linkedin" class="w-6 h-6 text-blue-700" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Animated Icons -->
      <section class="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-6 flex items-center">
          <span class="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center mr-3">
            <Icon name="mdi:animation" class="w-5 h-5 text-white" />
          </span>
          动画效果
        </h2>
        <div class="space-y-6">
          <div class="flex items-center gap-8">
            <div class="flex flex-col items-center gap-3">
              <Icon name="mdi:heart" class="text-red-500 animate-pulse" />
              <span class="text-xs text-gray-500">animate-pulse</span>
            </div>
            <div class="flex flex-col items-center gap-3">
              <Icon name="mdi:coffee" class="text-amber-500 animate-spin" />
              <span class="text-xs text-gray-500">animate-spin</span>
            </div>
            <div class="flex flex-col items-center gap-3">
              <Icon name="mdi:check-circle" class="text-green-500 animate-bounce" />
              <span class="text-xs text-gray-500">animate-bounce</span>
            </div>
            <div class="flex flex-col items-center gap-3">
              <Icon name="mdi:bell" class="text-purple-500 animate-ping" />
              <span class="text-xs text-gray-500">animate-ping</span>
            </div>
          </div>

          <!-- Hover Animation -->
          <div>
            <h3 class="text-lg font-semibold text-gray-700 mb-3">Hover 动画</h3>
            <div class="flex items-center gap-6">
              <button class="p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors group">
                <Icon name="mdi:heart" class="text-gray-600 group-hover:text-red-500 group-hover:scale-125 transition-all" />
              </button>
              <button class="p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors group">
                <Icon name="mdi:star" class="text-gray-600 group-hover:text-yellow-500 group-hover:rotate-12 transition-all" />
              </button>
              <button class="p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors group">
                <Icon name="mdi:reply" class="text-gray-600 group-hover:text-green-500 group-hover:scale-110 transition-all" />
              </button>
              <button class="p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors group">
                <Icon name="mdi:arrow-right" class="text-gray-600 group-hover:text-blue-500 group-hover:translate-x-2 transition-all" />
              </button>
            </div>
          </div>

          <!-- Loading States -->
          <div>
            <h3 class="text-lg font-semibold text-gray-700 mb-3">加载状态</h3>
            <div class="flex items-center gap-6">
              <div class="flex flex-col items-center gap-2">
                <Icon name="mdi:loader" class="animate-spin w-8 h-8 text-indigo-600" />
                <span class="text-xs text-gray-500">加载中...</span>
              </div>
              <div class="flex flex-col items-center gap-2">
                <Icon name="mdi:check-circle" class="w-8 h-8 text-green-500" />
                <span class="text-xs text-gray-500">成功</span>
              </div>
              <div class="flex flex-col items-center gap-2">
                <Icon name="mdi:alert" class="w-8 h-8 text-red-500" />
                <span class="text-xs text-gray-500">警告</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Aliases -->
      <section class="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-6 flex items-center">
          <span class="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center mr-3">
            <Icon name="mdi:label" class="w-5 h-5 text-white" />
          </span>
          图标别名
        </h2>
        <p class="text-gray-600 mb-4">
          可以在 <code>app.config.ts</code> 中定义别名，方便图标切换和管理。
        </p>
        <div class="overflow-x-auto">
          <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
<code>// app.config.ts
export default defineAppConfig({
  icon: {
    aliases: {
      'nuxt': 'logos:nuxt-icon',
      'github': 'bi:github',
      'twitter': 'bi:twitter',
      'heart': 'mdi:heart',
      'star': 'mdi:star',
    }
  }
})</code></pre>
        </div>
        <div class="mt-6 flex items-center gap-4">
          <div class="flex flex-col items-center gap-2">
            <Icon name="nuxt" class="w-12 h-12" />
            <span class="text-xs text-gray-500">nuxt (logos:nuxt-icon)</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <Icon name="github" class="w-12 h-12" />
            <span class="text-xs text-gray-500">github (bi:github)</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <Icon name="twitter" class="w-12 h-12" />
            <span class="text-xs text-gray-500">twitter (bi:twitter)</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <Icon name="heart" class="w-12 h-12 text-red-500" />
            <span class="text-xs text-gray-500">heart (mdi:heart)</span>
          </div>
        </div>
      </section>

      <!-- Render Modes -->
      <section class="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-6 flex items-center">
          <span class="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center mr-3">
            <Icon name="mdi:layers" class="w-5 h-5 text-white" />
          </span>
          渲染模式
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- CSS Mode -->
          <div>
            <h3 class="text-xl font-semibold text-gray-800 mb-4">
              <Icon name="mdi:toggle-switch" class="inline w-5 h-5 mr-2 text-green-600" />
              CSS 模式（默认）
            </h3>
            <p class="text-gray-600 mb-4">
              使用伪元素 ::before 或 ::after 渲染图标，性能更好，文件体积更小。
            </p>
            <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
<code>&lt;Icon name="mdi:heart" mode="css" /&gt;</code></pre>
            <div class="mt-4 flex items-center gap-4">
              <Icon name="mdi:star" mode="css" size="32" />
              <Icon name="mdi:home" mode="css" size="32" />
              <Icon name="mdi:settings" mode="css" size="32" />
            </div>
          </div>

          <!-- SVG Mode -->
          <div>
            <h3 class="text-xl font-semibold text-gray-800 mb-4">
              <Icon name="mdi:svg" class="inline w-5 h-5 mr-2 text-blue-600" />
              SVG 模式
            </h3>
            <p class="text-gray-600 mb-4">
              渲染为真实的 SVG 元素，可以直接通过 CSS 选择器操作。
            </p>
            <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
<code>&lt;Icon name="mdi:heart" mode="svg" /&gt;</code></pre>
            <div class="mt-4 flex items-center gap-4">
              <Icon name="mdi:star" mode="svg" size="32" />
              <Icon name="mdi:home" mode="svg" size="32" />
              <Icon name="mdi:settings" mode="svg" size="32" />
            </div>
          </div>
        </div>
      </section>

      <!-- Server Bundle -->
      <section class="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-6 flex items-center">
          <span class="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center mr-3">
            <Icon name="mdi:server" class="w-5 h-5 text-white" />
          </span>
          服务端打包 (Server Bundle)
        </h2>
        <p class="text-gray-600 mb-6">
          服务端打包允许在服务端渲染时提供图标，减少客户端请求。
        </p>

        <!-- Server Bundle Local -->
        <div class="mb-8">
          <h3 class="text-xl font-semibold text-gray-800 mb-4">
            <Icon name="mdi:folder" class="inline w-5 h-5 mr-2 text-purple-600" />
            本地模式 (local)
          </h3>
          <p class="text-gray-600 mb-4">
            将已安装的图标集合（如 <code>@iconify-json/*</code>）打包到服务端。
          </p>
          <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
<code>export default defineNuxtConfig({
  modules: ['@nuxt/icon'],
  icon: {
    serverBundle: 'local' // 默认模式
  }
})</code></pre>
        </div>

        <!-- Server Bundle Remote -->
        <div class="mb-8">
          <h3 class="text-xl font-semibold text-gray-800 mb-4">
            <Icon name="mdi:cloud" class="inline w-5 h-5 mr-2 text-blue-600" />
            远程模式 (remote)
          </h3>
          <p class="text-gray-600 mb-4">
            从 CDN 加载图标集合，适用于 Serverless 环境。
          </p>
          <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
<code>export default defineNuxtConfig({
  modules: ['@nuxt/icon'],
  icon: {
    serverBundle: {
      remote: 'jsdelivr' // 'unpkg' 或 'github-raw'
    }
  }
})</code></pre>
        </div>

        <!-- Server Bundle Auto -->
        <div>
          <h3 class="text-xl font-semibold text-gray-800 mb-4">
            <Icon name="mdi:auto-fix" class="inline w-5 h-5 mr-2 text-green-600" />
            自动模式 (auto)
          </h3>
          <p class="text-gray-600">
            默认选项，根据部署环境自动选择 <code>local</code> 或 <code>remote</code>。
            除非部署在 Serverless 或 Worker 环境，否则默认使用 <code>local</code>。
          </p>
        </div>
      </section>

      <!-- Client Bundle -->
      <section class="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-6 flex items-center">
          <span class="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
            <Icon name="mdi:package-variant" class="w-5 h-5 text-white" />
          </span>
          客户端打包 (Client Bundle)
        </h2>
        <p class="text-gray-600 mb-6">
          对于频繁使用的图标，可以将其打包到客户端，避免网络请求。
        </p>

        <div class="overflow-x-auto">
          <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
<code>export default defineNuxtConfig({
  modules: ['@nuxt/icon'],
  icon: {
    clientBundle: {
      // 显式指定要打包的图标
      icons: ['mdi:home', 'mdi:heart', 'mdi:star'],

      // 扫描项目中的组件并打包使用的图标
      scan: true,

      // 打包自定义集合
      includeCustomCollections: true,

      // 未压缩大小限制（KB）
      sizeLimitKb: 256,
    }
  }
})</code></pre>
        </div>

        <div class="mt-6">
          <h3 class="text-lg font-semibold text-gray-700 mb-3">扫描优化示例</h3>
          <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
<code>export default defineNuxtConfig({
  icon: {
    clientBundle: {
      scan: {
        // 替换默认的扫描目标
        globInclude: ['components/**/*.vue', 'pages/**/*.vue'],
        globExclude: ['node_modules', 'dist', '.nuxt'],
      },
    },
  }
})</code></pre>
        </div>
      </section>

      <!-- Usage Tips -->
      <section class="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-6 flex items-center">
          <span class="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center mr-3">
            <Icon name="mdi:lightbulb" class="w-5 h-5 text-white" />
          </span>
          使用建议
        </h2>
        <div class="space-y-4">
          <div class="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
            <h4 class="font-semibold text-blue-800 mb-2">选择合适的图标集合</h4>
            <p class="text-sm text-blue-700">
              <strong>Material Design Icons</strong> (mdi)：最常用的图标集合，包含超过 50,000 个图标，适合大多数场景。
            </p>
          </div>
          <div class="p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
            <h4 class="font-semibold text-green-800 mb-2">按需安装图标集合</h4>
            <p class="text-sm text-green-700">
              不要安装 <code>@iconify/json</code>（包含所有图标），这会增加打包体积。使用 <code>@iconify-json/集合名</code> 按需安装。
            </p>
          </div>
          <div class="p-4 bg-purple-50 border-l-4 border-purple-500 rounded-r-lg">
            <h4 class="font-semibold text-purple-800 mb-2"> Tailwind CSS 集成</h4>
            <p class="text-sm text-purple-700">
              可以直接使用 Tailwind 的工具类来控制图标的大小（<code class="bg-purple-100 px-1 py-0.5 rounded text-xs font-mono">w-6 h-6</code>）和颜色（<code class="bg-purple-100 px-1 py-0.5 rounded text-xs font-mono">text-gray-500</code>），更加灵活。
            </p>
          </div>
          <div class="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-lg">
            <h4 class="font-semibold text-yellow-800 mb-2">性能优化 - 使用别名</h4>
            <p class="text-sm text-yellow-700">
              使用 <code>app.config.ts</code> 中的 <code>aliases</code> 定义别名，方便图标切换和管理。
            </p>
          </div>
          <div class="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
            <h4 class="font-semibold text-red-800 mb-2">避免动态生成图标名称</h4>
            <p class="text-sm text-red-700">
              静态分析只能检测字面量用法。避免动态构造图标名称：
            </p>
            <pre class="bg-red-100 px-4 py-2 rounded mt-2 overflow-x-auto text-xs font-mono">
<code>// 不推荐
&lt;Icon :name="`mdi:${iconName}`" /&gt;

// 推荐
&lt;Icon :name="isDark ? 'mdi:moon' : 'mdi:sun'" /&gt;</code></pre>
          </div>
          <div class="p-4 bg-teal-50 border-l-4 border-teal-500 rounded-r-lg">
            <h4 class="font-semibold text-teal-800 mb-2">使用 Server Bundle</h4>
            <p class="text-sm text-teal-700">
              默认使用 <code>serverBundle: 'auto'</code>，在服务端渲染图标，减少客户端 HTTP 请求。
            </p>
          </div>
        </div>
      </section>

      <!-- Icons Picker Link -->
      <section class="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-6 flex items-center">
          <span class="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center mr-3">
            <Icon name="mdi:magnify" class="w-5 h-5 text-white" />
          </span>
          图标选择器
        </h2>
        <p class="text-gray-600 mb-4">
          浏览和选择超过 200,000 个可用图标：
        </p>
        <a
          href="https://icones.js.org/"
          target="_blank"
          class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
        >
          <Icon name="mdi:asterisk" />
          访问 Icones.js.org
          <Icon name="mdi:arrow-right" />
        </a>
      </section>

      <!-- Footer -->
      <footer class="text-center text-gray-500">
        <p>使用 Nuxt Icon 模块构建美观的图标界面</p>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
// Material Design Icons
const mdiIcons = [
  'heart',
  'star',
  'home',
  'settings',
  'account',
  'email',
  'lock',
  'eye',
  'search',
  'menu',
  'close',
  'check',
  'alert',
  'trash',
  'pencil',
  'download',
  'upload',
  'share',
  'bell',
  'clock',
  'calendar',
  'folder',
  'file',
  'image',
  'music',
  'video',
  'wifi',
  'bluetooth',
  'battery',
  'currency',
]

// Video Game UI Icons
const uilIcons = [
  'github',
  'star',
  'home',
  'settings',
  'user',
  'envelope',
  'lock',
  'eye',
  'magnifying-glass',
  'menu',
  'x',
  'check-circle',
  'warning',
  'trash',
  'pencil',
  'download',
  'upload',
  'share',
  'bell',
  'clock',
  'calendar',
  'folder',
  'file',
]

// Phosphor Icons
const phIcons = [
  'heart',
  'star',
  'home',
  'settings',
  'user',
  'envelope',
  'lock',
  'eye',
  'magnifying-glass',
  'menu',
  'x',
  'check-circle',
  'warning',
  'trash',
  'pencil',
  'download',
  'upload',
  'share',
  'bell',
  'clock',
  'calendar',
  'folder',
  'file',
]

// Font Awesome
const faIcons = [
  'FontAwesome',
  'heart',
  'star',
  'home',
  'cog',
  'user',
  'envelope',
  'lock',
  'eye',
  'search',
  'bars',
  'times',
  'check-circle',
  'exclamation-triangle',
  'trash',
  'pencil',
  'download',
  'upload',
  'share-alt',
  'bell',
  'clock',
  'calendar',
  'folder',
  'file',
]
</script>
