// https://nuxt.com/docs/guide/directory-structure/app-config
export default defineAppConfig({
  icon: {
    size: '24px', // default <Icon> size applied
    class: 'icon', // default <Icon> class applied
    mode: 'css', // default <Icon> mode applied
    aliases: {
      // Define aliases to make swapping out icons easier
      'nuxt': 'logos:nuxt-icon',
      'github': 'bi:github',
      'twitter': 'bi:twitter',
      'heart': 'mdi:heart',
      'star': 'mdi:star',
    },
    cssLayer: 'base', // set the css layer to inject to
  },
})
