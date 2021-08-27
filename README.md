![nuxt-delay-hydration](https://repository-images.githubusercontent.com/343991410/68f83b80-811f-11eb-9638-51aed75785c4)


<h1 align='center'>nuxt-delay-hydration</h1>

<p align='center'>
Improve your Nuxt.js Google Lighthouse score by delaying hydration ⚡️<br>
</p>

<p align='center'>
<a href='https://www.npmjs.com/package/nuxt-delay-hydration'>
<img src='https://img.shields.io/npm/v/nuxt-delay-hydration?color=0EA5E9&label='>
<img src='https://github.com/harlan-zw/nuxt-delay-hydration/actions/workflows/test.yml/badge.svg' >
</a>
</p>


## Features

- ⚡️ Instantly increase your Google Lighthouse score by reducing "Blocking Time"
- 🍃 Pre-configured to minimise user experience issues
- 🧩 Multiple implementation options
- 🔁 (optional) Replay pre-hydration clicks

<br>

<details>
  <summary><b>Should I use this module</b></summary>

⚠️ This module is beta. It is tested on simple full-static Nuxt.js (SSG) apps, such as
documentation, blogs and misc content sites. It will not run in any other mode at this stage.

- **Full Static** You are building your app as full static (SSG)
- **JS Enhancements only** The core function of your app works without JavaScript.
- **Pre-optimised** Your app has been optimised for [LCP](https://web.dev/lcp/) and [CLS](https://web.dev/cls/).
</details>

<br>

<details>
  <summary><b>Motivation</b></summary>

Hydrating Vue apps is expensive, especially with Vue 2. Google Lighthouse penalises hydration with a high "Total Blocking Time" and "Time to Interactive".

While this is unavoidable in most apps, for static sites which depend on minimal interactivity, it is possible and safe
to delay the hydration to avoid this penalty.

The current solution for delaying hydration is [vue-lazy-hydration](https://github.com/maoberlehner/vue-lazy-hydration) which works well.
However, it can require a lot of tinkering, may break your HMR and add avoidable complexity.

Nuxt Delay Hydration aims to provide optimisations with  minimal tinkering, by making certain assumptions on trade-offs
you're willing to make.
</details>

<br>

<details>
  <summary><b>How it works</b></summary>

A promise is injected into your app. 
The promise is resolved as soon as either of these events have fired:

- an interaction event (scroll, click, etc)
- an idle callback with a fixed timeout

Depending on which mode you pick, depends on where in your apps lifecycle the promise is awaited.
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

<details>
  <summary><h3 style="display:inline-block">Benchmarking</h3></summary>
It's important to measure the performance changes this module and any configuration changes you make.

The simplest way to benchmark is to use the Google Lighthouse tool within Google Chrome.

I recommend generating your static app completely in production mode and start it. `nuxt geneeate && nuxt start`

Open a private window and begin the performance tests. You will want to look at the score overall and the Total Blocking Time.
</details>

## Choosing a mode

By default, no mode is selected. You will need to select how you would like to delay the hydration for the module to work.

*Type:* `init` | `mount` | `manual` | `false`

*Default:* `false`

| Type   |      Description    | Use Case |
|----------|:-------------|------:|
| `false` _default_ |  Disable the module | Testing |
| [init](#init-mode) | Delays Nuxt app creation. All code is delayed including plugins and third-party scripts. |  Zero or minimal plugins / modules. |
| [mount](#mount-mode) | Delays Nuxt after creation and before mounting. Plugins and some third-party scripts will work. |   Minimal non-critical plugins and third-party plugins. |
| [manual](#manual-mode) | Delay is provided by the `DelayHydration` component. Extends `vue-lazy-hydration` |  All other apps |

Regardless of the mode you choose, please read [further app optimisations](#further-app-optimisations).

### Init Mode

Delays hydration before the Nuxt app is created. Your entire app, including plugins, will be delayed. 
This will provide the biggest speed improvements however is the riskiest and may increase
other metrics with delayed network requests.

_Pros:_ Provides the biggest blocking time reduction

_Cons:_ Risky if you have critical third party scripts

_Benchmark:_ ~90% reduction

```js
export default {
  delayHydration: {
    mode: 'init'
  }
}
```

### Mount Mode

Delays hydration once your app is created (all plugins and vendor bundle loaded) and is about to be mounted. This blocks
your layout from being loaded.

_Pros:_ Safer and still provides significant good optimisation

_Cons:_ May still break certain layouts if they are js dependent.

_Benchmark:_ ~70% reduction

```js
export default {
  delayHydration: {
    mode: 'mount'
  }
}
```


### Manual Mode

Only delays the hydration of template code where it's used. Useful for when you need some part of the
page to always hydrate immediately, such as a navigation drawer.

_Pros:_ Safest way to optimise 

_Cons:_ May not provide significant improvements

_Benchmark:_ ?% reduction

```js
export default {
  delayHydration: {
    mode: 'manual'
  }
}
```

## Further App Optimisations

### Reducing JavaScript payloads

#### Avoid bundling some plugins to server & app

For certain scripts, mostly third-party, we want to avoid having them pre-rendered in your app.

For example if you use a chat widget  or Google Tag Manager on your site, you will want to make sure this plugin is _client only_ 
to reduce th



## Advanced Configuration

Configuration should be provided on the `delayHydration` key within your nuxt config.



## Credits

- [Markus Oberlehner](https://github.com/maoberlehner). Great articles on Vue hydration and vue-lazy-hydration 


## License

MIT License © 2021 [Harlan Wilton](https://github.com/harlan-zw)

