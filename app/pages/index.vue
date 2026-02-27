<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="container mx-auto px-4 py-16">
      <!-- Header -->
      <header class="text-center mb-12">
        <h1 class="text-5xl font-bold text-gray-900 mb-4">
          Welcome to Nuxt + Tailwind CSS
        </h1>
        <p class="text-xl text-gray-600">
          A modern web development stack
        </p>
      </header>

      <!-- Features Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <!-- Feature 1 -->
        <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div class="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Fast Development</h3>
          <p class="text-gray-600">Hot module replacement and instant updates for rapid development.</p>
        </div>

        <!-- Feature 2 -->
        <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div class="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Utility-First CSS</h3>
          <p class="text-gray-600">Build custom designs quickly with Tailwind's utility classes.</p>
        </div>

        <!-- Feature 3 -->
        <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div class="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Responsive Design</h3>
          <p class="text-gray-600">Mobile-first responsive layouts with simple prefix classes.</p>
        </div>
      </div>

      <!-- Button Showcase -->
      <div class="flex flex-wrap justify-center gap-4 mb-16">
        <button class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
          Primary Button
        </button>
        <button class="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors">
          Secondary Button
        </button>
        <button class="px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors">
          Outline Button
        </button>
      </div>

      <!-- Color Palette -->
      <div class="bg-white rounded-xl shadow-lg p-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">Tailwind Color Palette</h2>
        <div class="grid grid-cols-5 gap-4">
          <div class="space-y-2">
            <div class="h-12 rounded bg-red-500"></div>
            <div class="h-12 rounded bg-red-400"></div>
            <div class="h-12 rounded bg-red-300"></div>
            <div class="h-12 rounded bg-red-200"></div>
            <div class="h-12 rounded bg-red-100"></div>
          </div>
          <div class="space-y-2">
            <div class="h-12 rounded bg-orange-500"></div>
            <div class="h-12 rounded bg-orange-400"></div>
            <div class="h-12 rounded bg-orange-300"></div>
            <div class="h-12 rounded bg-orange-200"></div>
            <div class="h-12 rounded bg-orange-100"></div>
          </div>
          <div class="space-y-2">
            <div class="h-12 rounded bg-amber-500"></div>
            <div class="h-12 rounded bg-amber-400"></div>
            <div class="h-12 rounded bg-amber-300"></div>
            <div class="h-12 rounded bg-amber-200"></div>
            <div class="h-12 rounded bg-amber-100"></div>
          </div>
          <div class="space-y-2">
            <div class="h-12 rounded bg-green-500"></div>
            <div class="h-12 rounded bg-green-400"></div>
            <div class="h-12 rounded bg-green-300"></div>
            <div class="h-12 rounded bg-green-200"></div>
            <div class="h-12 rounded bg-green-100"></div>
          </div>
          <div class="space-y-2">
            <div class="h-12 rounded bg-blue-500"></div>
            <div class="h-12 rounded bg-blue-400"></div>
            <div class="h-12 rounded bg-blue-300"></div>
            <div class="h-12 rounded bg-blue-200"></div>
            <div class="h-12 rounded bg-blue-100"></div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <footer class="text-center mt-16 text-gray-500">
        <p>Built with Nuxt 3 and Tailwind CSS</p>
      </footer>
    </div>
  </div>
</template>

<script setup>
// Page setup logic here
</script>
