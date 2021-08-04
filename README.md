![nuxt-windicss](https://repository-images.githubusercontent.com/343991410/68f83b80-811f-11eb-9638-51aed75785c4)

<h1 align='center'>nuxt-windicss</h1>

<p align='center'><a href="https://windicss.org/">Windi CSS</a> for Nuxt.js! ⚡️<br>
<sup><em>Next generation utility-first CSS framework.</em></sup>
</p>

<p align='center'>
<a href='https://www.npmjs.com/package/nuxt-windicss'>
<img src='https://img.shields.io/npm/v/nuxt-windicss?color=0EA5E9&label='>
<img src='https://github.com/windicss/nuxt-windicss-module/actions/workflows/test.yml/badge.svg' >
</a>
</p>


## Features

- ⚡️ **It's FAST** - 20~100x times faster than [@nuxtjs/tailwindcss](https://github.com/nuxt-community/tailwindcss-module)
- 🧩 On-demand CSS utilities (Compatible with Tailwind CSS v2) and native elements style resetting
- 🍃 Load configurations from `tailwind.config.js`
- 📄 Use `@apply` / `@screen` directives in any file: Vue SFC, Less, SCSS, SASS, PostCSS, Stylus
- 🎳 Support Utility Groups - e.g. `bg-gray-200 hover:(bg-gray-100 text-red-300)`
- 🧑‍🤝‍🧑 Works with [@nuxt/vite](https://github.com/nuxt/vite) & [@nuxt/content](https://content.nuxtjs.org/)

## Install

```bash
yarn add nuxt-windicss -D
# npm i nuxt-windicss -D
```

## Usage

Within your `nuxt.config.js` add the following.

```js
// nuxt.config.js
export default {
  buildModules: [
    'nuxt-windicss',
  ],
}
```

### Ordering (optional)

By default, this module will load all of the windi layers togethor beyond your CSS.

If you'd like to change the layout ordering you can manually include the layers where you want them. 

For example, you had a `main.css` which had `h1 { margin-bottom: 30px; }`, you might do something like this:

```js
// nuxt.config.js
export default {
  // ...
  css: [
    // windi preflight
    'virtual:windi-base.css',
    // your stylesheets which overrides the preflight
    '@/css/main.css', 
    // windi extras
    'virtual:windi-components.css',
    'virtual:windi-utilities.css',
  ],
}
```

Note: if you're adding any of the virtual modules yourself, it will disable all the automatic imports.

## Migrating from tailwind

This module won't work with `@nuxtjs/tailwindcss`, you will need to remove it.

```diff
buildModules: [
-  '@nuxtjs/tailwindcss',
],
```

If you have a `tailwind.config.js`, please rename it to `windi.config.js` or `windi.config.ts`.

Follow the [migration guide](https://windicss.org/guide/migration.html) for other change details.


## Documentation

Read the [documentation](https://windicss.org/integrations/nuxt.html) for more details.

## Credits

- Windy team
- [@antfu](https://github.com/antfu) Based on his Rollup / Vite implementation & his util package


## License

MIT License © 2021 [Harlan Wilton](https://github.com/harlan-zw)

