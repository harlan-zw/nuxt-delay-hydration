![nuxt-delay-hydration](https://repository-images.githubusercontent.com/392525648/2875f133-bb97-4758-87fa-3fe69c3859af)

<p align='center'>
<a href='https://www.npmjs.com/package/nuxt-delay-hydration'>
<img src='https://img.shields.io/npm/v/nuxt-delay-hydration?color=0EA5E9&label='>
</a>
<a href="https://www.npmjs.com/package/nuxt-delay-hydration" target="__blank"><img alt="NPM Downloads" src="https://img.shields.io/npm/dm/nuxt-delay-hydration?color=0EA5E9&label="></a>
<a href='https://github.com/harlan-zw/nuxt-delay-hydration/actions/workflows/test.yml'>
<img src='https://github.com/harlan-zw/nuxt-delay-hydration/actions/workflows/test.yml/badge.svg' >
</a>
</p>

<p align="center">
<table>
<tbody>
<td align="center">
<img width="800" height="0" /><br>
<i>Status:</i> <b>Stable v2 <a href="https://github.com/harlan-zw/nuxt-delay-hydration/tree/v1">v0</a> ✅ , v3 <a href="https://github.com/harlan-zw/nuxt-delay-hydration">main</a> ✅</b><br>
<sub>Made possible by my <a href="https://github.com/sponsors/harlan-zw">Sponsor Program 💖</a><br> Follow me <a href="https://twitter.com/harlan_zw">@harlan_zw</a> 🐦</sub><br>
<img width="800" height="0" />
</td>
</tbody>
</table>
</p>

⚠️ This is a "hack" to trick Google Lighthouse into thinking your site is faster than it otherwise would be.
- It should only ever be used for progressively enhanced websites.
- It may not provide any real performance or SEO benefit (test it with [CrUX](https://developer.chrome.com/docs/crux/), not Google Lighthouse).

## Features

- 🔥 Reduce your sites "Blocking Time"
- 🚦 Per-page level configuration using route rules
- 🔁 (optional) Replay pre-hydration clicks

<br>

<details>
  <summary><b>Why delay hydration?</b></summary>
<br>

Delaying hydration is a technique to hint to Google that our scripts are not required for our app to function.

By delaying hydration we improve the Google Lighthouse score by reducing your "Blocking Time" metric.

Previously you may have used [vue-lazy-hydration](https://github.com/maoberlehner/vue-lazy-hydration) which works well.
However, it is just a more verbose way of providing hints to Google, like we're doing with this module.

</details>

<br>

<details>
  <summary><b>What is a progressively enhanced app?</b></summary>
<br>

A progressively enhanced app is one that is designed to work without JavaScript, and then progressively enhanced with JavaScript.

Your scripts should not be required to use your website, this is what we're hinting to Google by delaying the hydration.

To do that you can ensure:
- Full HTML served on the initial response
- Scripts don't trigger a [CLS](https://web.dev/cls/)
- Avoid using scripts to set images, will affect the [LCP](https://web.dev/lcp/)

</details>

<br>

<details>
  <summary><b>How this module works</b></summary>
<br>
A promise is injected into your app, the location is based on the mode. The promise is resolved as soon as either of these events has fired:

- an interaction event (mouse move, scroll, click, etc)
- an idle callback with a fixed timeout

The idle CPU time hints to Google that these scripts are not required for your app to run.

For example:
- if a Google bot visits the page and has no interaction, out of the box the hydration won't occur until the browser
  idle callback + 6 seconds
- if a user visits the page and moves their cursor or scrolls, the hydration will be triggered immediately. The chance of interacting with the
  non-hydration app will be minimised

Keep in mind, **this is a hacky solution**. Until Google can recognise progressive script enhancements, we'll need to rely on this approach.
</details>

<br>

## Install

If you're using Nuxt 2.x, please follow the docs on the [v0 branch](https://github.com/harlan-zw/nuxt-delay-hydration/tree/v0). ⚠️ Nuxt 2 is deprecated and won't receive support.

```bash
npx nuxi@latest module add delay-hydration
```

_Requirement: Progressively enhanced SSR or SSG Nuxt app._

<br>

## Usage

```ts
// nuxt.config.ts
export default {
  modules: [
    'nuxt-delay-hydration',
  ],
  delayHydration: {
    // enables nuxt-delay-hydration in dev mode for testing
    // NOTE: you should disable this once you've finished testing, it will break HMR
    debug: process.env.NODE_ENV === 'development'
  }
}
```

_Note: The module will not run in development unless you have enabled [debug](#debugging)._

## Choosing a mode

By default, no mode is selected, you will need to select how you would the module to work.

*Type:* `init` | `mount`| `manual` | `false`

*Default:* `false`

| Type   | Description                                                                      | Use Case |
|----------|:---------------------------------------------------------------------------------|------:|
| `false` _default_ | Disable the module                                                               | Testing |
| [init](#init-mode) | Delays all scripts from loading.                                                 |  Zero or minimal plugins/modules. |
| [mount](#mount-mode) _recommended_ | Delays Nuxt while it's mounting. Plugins and some third-party scripts will work. |   Minimal non-critical plugins and third-party plugins. |
| [manual](#manual-mode) | Delay is provided by the `DelayHydration` component.                             |  All other apps |

Regardless of the mode you choose, please read [further optimisations](#further-optimisations).

### Init Mode

This mode delays all scripts from loading until the hydration promise is resolved.

It does this by hooking into the HTML rendering, removing all script tags and adding them back after the hydration promise is resolved.

This will provide the biggest speed improvements however is the riskiest.

_Pros:_ Provides the biggest blocking time reduction

_Cons:_ Risky if you have critical third party scripts

_Benchmark:_ ~90-100% reduction

```js
export default {
  delayHydration: {
    mode: 'init'
  }
}
```

### Mount Mode

This mode delays Nuxt while it's mounting. Plugins and some third-party scripts will work.

This delays your layout and page components.

_Pros:_ Safer and still provides good improvements

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

Using the manual mode, you manually specify what part of your app you'd like to delay. Useful for when you need some part of the
page to always hydrate immediately, such as a navigation drawer.

_Pros:_ Safest way to optimise

_Cons:_ Speed improvement based on usage

```js
export default {
  delayHydration: {
    mode: 'manual'
  }
}
```

#### DelayHydration component

Once you have set the mode, you need to use the component.

```vue
<template>
  <div>
    <DelayHydration>
      <div>
        <LazyMyExpensiveComponent />
      </div>
    </DelayHydration>
  </div>
</template>
```

## Guides

### Per-Page Configuration

You can configure the module on a per-page basis using route rules.

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    // delay the home page
    '/': { delayHydration: 'mount' },
    // disable the module for the admin
    '/admin/': { delayHydration: false }
  }
})
```

You can also define them are your page-level using [defineRouteRules](https://nuxt.com/docs/api/utils/define-route-rules).

### Debugging

<details>
  <summary>Debug mode</summary>
<br>
It's recommended that you do thorough testing on your app with the module before deploying it into production.

To make sure the module is doing what you expect, there is a `debug` mode, which when enabled will log behaviour in the console.

It might be a good idea to always debug on your local environment, in that instance you could do:

```ts
export default defineNuxtConfig({
  delayHydration: {
    debug: process.env.NODE_ENV === 'development',
  },
})
```
</details>
<br>

<details>
  <summary>Visualising the hydration status</summary>
<br>
It can be unclear at times whether your app has been hydrated or not if it's quite static, this can make debugging hard.

To make things easier, there is a component `HydrationStatus` which will tell you what's going on.

```vue
<template>
  <div>
    <MyHeader />
    <DelayHydration>
      <div>
        <!-- Show the hydration status, only for debugging -->
        <HydrationStatus />
        <main>
          <nuxt />
        </main>
        <my-footer />
      </div>
    </DelayHydration>
  </div>
</template>
```

</details>

### Performance Auditing

Use my audit tool: https://unlighthouse.dev/

### Replaying hydration click

<details>
  <summary>What is this and how to enable</summary>
<br>
One of the issues with delaying hydration is that a user interaction event can occur before your scripts are loaded, leading
to a user having to click on something multiple times for it to do what they expect. Think of a hamburger that is triggered using Javascript, if your
app isn't hydrated then clicking it won't do anything.

The best fix for this is to write your [HTML in a way that doesn't need Javascript](https://css-tricks.com/the-checkbox-hack/) to be interactive.

However, there are use cases where you need to use Javascript and responding to the first click is important. In those instances, you can enable
the replay of the click.

```js
export default defineNuxtConfig({
  delayHydration: {
    replayClick: true
  },
})
```

This is an experimental configuration, you should test this option yourself before implementing it into your production app.
</details>

### Further Optimisations

<details>
  <summary>Load heavy components async</summary>
<br>
When you load in a heavy component synchronously, the javascript will be bundled in with the main application payload.

This will decrease all of your performance metrics. It's recommended you use async imports for these components.

Run `nuxi analyze` to find large components. When loading them, prefix them with `Lazy`.

</details>

## Advanced Configuration

Configuration should be provided on the `delayHydration` key within your Nuxt config.

If you're finding the lab or [field data](https://web.dev/lab-and-field-data-differences/) is not performing, you may want to
tinker with this advanced configuration.

### Filtering routes

Note: It's recommended to use route rules instead of these filtering options.

Using the `include` and `exclude` options, you can specify which routes you'd like to delay hydration on.

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  delayHydration: {
    include: [
      '/blog/**',
    ],
    exclude: [
      '/admin/**'
    ],
  },
})
```

You can provide a glob pattern similar to route rules or a regex.

### Event Hydration

**hydrateOnEvents**

- Type: `string[]`
- Default: `[ 'mousemove', 'scroll', 'keydown', 'click', 'touchstart', 'wheel' ]`

Controls which browser events should trigger the hydration to resume. By default, it is quite aggressive to avoid
possible user experience issues.

**replayClick**

- Type: `boolean`
- Default: `false`

If the trigger for hydration was a click, you can replay it. Replaying it will re-execute the event when it is presumed your app is hydrated.

For example, if a user clicks a hamburger icon and hydration is required to open the menu, it would replay the click once hydrated.

⚠️ This is experimental, use with caution.

### Idle Hydration

**idleCallbackTimeout**

- Type: `number` (milliseconds)
- Default: `7000`

When waiting for an idle callback, it's possible to define a max amount of time to wait in milliseconds. This is
 useful when there are a lot of network requests happening.

**postIdleTimeout**

- Type: `{ mobile: number, desktop: number }` (milliseconds)
- Default: `{ mobile: 5000, desktop: 4000, }`

How many to wait (in milliseconds) after the idle callback before we resume the hydration. This extra timeout is required
to avoid the standard "blocking", we need to provide real idle time to lighthouse.

Mobile should always be higher than desktop as the CPU capacity will generally be a lot less than a desktop.

_Note: The default will likely be customised in the future based on further benchmarking._

### Debugging

**debug**

- Type: `boolean`
- Default: `false`

Log details in the console on when hydration is blocked and when and why it becomes unblocked.

## Benchmarks

- [Pokemon](https://github.com/harlan-zw/nuxt-delay-hydration/blob/master/test/fixtures/pokemon/benchmarks.md)
- [Countries](https://github.com/harlan-zw/nuxt-delay-hydration/blob/master/test/fixtures/countries/benchmarks.md)
- [Manual](https://github.com/harlan-zw/nuxt-delay-hydration/blob/master/test/fixtures/manual/benchmarks.md)

Live examples

- https://www.odysseytraveller.com/
- https://massivemonster.co/

## Credits

- [Markus Oberlehner](https://github.com/maoberlehner). Pioneer of the lazy hydration in Vue

## Sponsors

<p align="center">
  <a href="https://raw.githubusercontent.com/harlan-zw/static/main/sponsors.svg">
    <img src='https://raw.githubusercontent.com/harlan-zw/static/main/sponsors.svg'/>
  </a>
</p>

## License

MIT License © 2022 - Present [Harlan Wilton](https://github.com/harlan-zw)
