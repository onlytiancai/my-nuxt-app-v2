# Project Rules

## Tech Stack

- **Framework**: Nuxt 4 (v4.3.1+)
- **Vue**: Vue 3.5.28+
- **CSS Framework**: Tailwind CSS (via @nuxtjs/tailwindcss)
- **Package Manager**: pnpm
- **Router**: Vue Router (Nuxt pages)

## Directory Structure

```
my-nuxt-app/
├── app/                      # Source directory (srcDir)
│   ├── app.vue               # Main app component (entry point)
│   ├── assets/               # CSS, images, fonts, etc.
│   ├── components/           # Auto-imported Vue components
│   ├── composables/          # Auto-imported composable functions
│   ├── layouts/              # Layout components
│   ├── pages/                # File-based routing pages
│   ├── plugins/              # Vue plugins
│   └── middleware/           # Route middleware
├── public/                   # Static assets (served at root)
├── node_modules/             # Dependencies
├── nuxt.config.ts            # Nuxt configuration
├── package.json              # Project dependencies
├── pnpm-lock.yaml            # pnpm lock file
├── tsconfig.json             # TypeScript configuration
└── .gitignore                # Git ignore rules
```

## Key Configuration

### nuxt.config.ts
```ts
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  srcDir: 'app/'  // Source code is in app/ directory
})
```

### package.json Scripts
```bash
pnpm dev       # Start development server
pnpm build     # Build for production
pnpm preview   # Preview production build
pnpm postinstall  # Post-install setup
```

## Conventions

1. **Page routing**: Add `.vue` files in `app/pages/` for automatic routes
2. **Components**: Place shared components in `app/components/` (auto-imported)
3. **Styling**: Use Tailwind CSS utility classes in templates
4. **Composables**: Place reusable composables in `app/composables/` (auto-imported)
5. **Static assets**: Place in `public/` directory

## Important Notes

- `app.vue` must be in `app/` directory (configured via `srcDir: 'app/'`)
- All source code goes under `app/` directory
- Tailwind CSS classes are available globally in all components
