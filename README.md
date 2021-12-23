_<h1 align='center'>nuxt-delay-hydration</h1>

<p align='center'>Improve your Nuxt.js Google Ligthouse score by delaying hydration ⚡️<br>
</p>

<p align='center'>
<a href='https://www.npmjs.com/package/nuxt-delay-hydration'>
<img src='https://img.shields.io/npm/v/nuxt-delay-hydration?color=0EA5E9&label='>
<img src='https://github.com/windicss/nuxt-delay-hydration/actions/workflows/test.yml/badge.svg' >
</a>
</p>


**Note: `@nuxt/bridge` and `nuxt3` are not supported yet.** 

## Features

- ⚡️ Unlock perfect Google Lighthouse scores
- 🍃 Pre-configured to minimise user experience issues
- 🧩 Multiple implementation options
- 🔁 Replay pre-hydration pointer events

## Motivation

Hydrating Vue apps, specifically Vue 2 server side generated (SSG - full static) apps
is expensive. Google Lighthouse penalises hydration with a high "Total Blocking Time" and "Time to Interactive".

While this is unavoidable in some apps, for mostly static sites which rely on minimal javascript interactivity, it is possible
to delay the hydration to reduce the penalty. 

The current solution for delaying hydration is [vue-lazy-hydration](https://github.com/maoberlehner/vue-lazy-hydration) which does the job, however it can 
 require a bit of tinkering to find a sweet spot.

This package aims to provide higher google page speed scores with  minimal tinkering by making the following assumptions:
- Hydration is always either trigger immediately with any user interaction or a minimal idle delay timeout.
- The entire app should be rehydrated quickly as possible once hydration trigger is fired
- Critical above-the-fold functionality _should_ work without javascript

### Benchmarks

**Mode Init**: 91% blocking time reduction

**Mode Mount**: 73% blocking time reduction

## Install

```bash
yarn add nuxt-delay-hydration -D
# npm i nuxt-delay-hydration -D
```

## Usage

Within your `nuxt.config.js` add the following.

```js
// nuxt.config.js
export default {
  buildModules: [
    'nuxt-delay-hydration',
  ],
}
```

⚠️ This module is currently experimental. Please see [testing your app](#testing-your-app).

## Configuration

All configuration is provided on the `delayHydration` key within your nuxt config.

### Mode

*Type:* `init` | `mount` | `manual`

*Default:* `mount`

#### Init Mode

Delays hydration before the Nuxt app is created. This means your entire app, including plugins, will be delayed. 
This will provide the biggest blocking time improvements however is the riskiest and may increase
other metrics with delayed network requests.

```js
export default {
  delayHydration: {
    mode: 'init'
  }
}
```

Use case: Zero or minimal plugins / modules.

#### Mount Mode

Delays hydration once the nuxt app is created (all plugins and dependencies loaded) and is about to be mounted. This blocks
your layout from being loaded.

```js
export default {
  delayHydration: {
    mode: 'mount'
  }
}
```

Use case: Minimal non-critical plugins and third-party plugins.

#### Manual Mode

Only delays the hydration of template code where it's used. Useful for when you need some part of the
page to always hydrate immediately, such as a navigation drawer.

```js
export default {
  delayHydration: {
    mode: 'manual'
  }
}
```

Use case: All other apps.


## Credits

- [Markus Oberlehner](https://github.com/maoberlehner). Great articles on Vue hydration and vue-lazy-hydration 


## License

MIT License © 2021 [Harlan Wilton](https://github.com/harlan-zw)_

