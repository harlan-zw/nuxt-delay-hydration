<h1 align='center'>nuxt-delay-hydration</h1>

<p align='center'>
Improve your Nuxt.js Google Ligthouse score by delaying hydration ⚡️<br>
</p>

<p align='center'>
<a href='https://www.npmjs.com/package/nuxt-delay-hydration'>
<img src='https://img.shields.io/npm/v/nuxt-delay-hydration?color=0EA5E9&label='>
<img src='https://github.com/windicss/nuxt-delay-hydration/actions/workflows/test.yml/badge.svg' >
</a>
</p>


## Features

- ⚡️ Instantly reduce your "Blocking Time" by over 90%
- 🍃 Pre-configured to minimise user experience issues
- 🧩 Multiple implementation options
- 🔁 Optionally replay pre-hydration click

Nuxt Delay Hydration aims to provide optimisations with  minimal tinkering, by making the following assumptions:
- **Pre-optimised** Your app has already been optimised for [LCP](https://web.dev/lcp/) and [CLS](https://web.dev/cls/).
- **Full App Hydration** The complexity of partially hydrating different parts of your app is not worth it verse a full hydration ASAP.
- **Non-Critical Above-the-fold Javascript** Interactivity provided above the page fold only uses JS for enhancement and not function.
- **Async Scripts Only** All JS is loaded async

<details>
  <summary><h2 style="display:inline-block">Motivation</h2></summary>

Hydrating Vue apps is expensive, especially with Vue 2. Google Lighthouse penalises hydration with a high "Total Blocking Time" and "Time to Interactive".

While this is unavoidable in most apps, for static sites which depend on minimal interactivity, it is possible and safe
to delay the hydration to avoid this penalty.

The current solution for delaying hydration is [vue-lazy-hydration](https://github.com/maoberlehner/vue-lazy-hydration) which works well.
However, it can require a lot of tinkering, may break your HMR and add avoidable complexity.

This module has been built as a quick and painless way to increase performance scores.
</details>

<details>
  <summary><h2 style="display:inline-block">How it works</h2></summary>
A promise is injected into your app, depending on which mode you pick, depends on where it's injected. 
The promise is resolved as soon as either of these events are fired:

- an interaction event (scroll, click, etc)
- an idle callback with a fixed timeout
</details>


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


<details>
  <summary><h3 style="display:inline-block">Benchmarking</h3></summary>
It's important to measure the performance changes this module and any configuration changes you make.

The simplest way to benchmark is to use the Google Lighthouse tool within Google Chrome.

I recommend generating your static app completely in production mode and start it. `nuxt geneeate && nuxt start`

Open a private window and begin the performance tests. You will want to look at the score overall and the Total Blocking Time.
</details>

<details>
  <summary><h3 style="display:inline-block">Choosing a mode</h3></summary>
It's important to measure the performance changes this module and any configuration changes you make.

The simplest way to benchmark is to use the Google Lighthouse tool within Google Chrome.

I recommend generating your static app completely in production mode and start it. `nuxt geneeate && nuxt start`

Open a private window and begin the performance tests. You will want to look at the score overall and the Total Blocking Time.
</details>

## Configuration

All configuration is provided on the `delayHydration` key within your nuxt config.

### Mode

*Type:* `init` | `mount` | `manual`

*Default:* `mount`

#### Init Mode

Delays hydration before the Nuxt app is created. Your entire app, including plugins, will be delayed. 
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

Delays hydration once your app is created (all plugins and vendor bundle loaded) and is about to be mounted. This blocks
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


### Benchmarks

**Mode Init**: 91% blocking time reduction

**Mode Mount**: 73% blocking time reduction


## License

MIT License © 2021 [Harlan Wilton](https://github.com/harlan-zw)

