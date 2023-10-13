<script>
export default {
  data() {
    return {
      bg: 'bg-gray-50',
      mobileMenuOpen: false,
    }
  },
}
</script>

<template>
  <div>
    <header>
      <nav class="relative text-sm bg-blue-500 text-white relative">
        <div class="container mx-auto flex items-center py-5">
          <nuxt-link to="/" class="font-bold">
            Home
          </nuxt-link>
          <!-- Menu Items - Right Aligned -->
          <div class="flex flex-grow justify-end">
            <!-- Mobile menu button -->
            <div class="flex items-center ml-3">
              <div
                for="mobile-nav"
                type="button"
                class="inline-flex items-center justify-center p-2 rounded-md text-gray-100 hover:text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded="false"
                @click="mobileMenuOpen = !mobileMenuOpen"
              >
                <span class="sr-only">Open main menu</span>
                <icon-hamburger
                  v-if="!mobileMenuOpen"
                  class="block h-8 w-8"
                />
                <icon-times
                  v-else
                  class="block h-8 w-8"
                />
              </div>
            </div>
          </div>
        </div>
        <!-- Mobile menu, show/hide based on menu state. -->
        <div v-if="mobileMenuOpen" class="animated animate-fade-in animate-duration-200 opacity-0 absolute left-0 top-fill top-0 z-20 bg-blue-700 w-screen h-screen">
          <div class="container mx-auto px-2 pt-2 pb-3 space-y-1">
            <div class="container mx-auto flex items-center py-5">
              <nuxt-link to="/" class="font-bold">
                Home - {{ $isServer ? 'Not Hydrated' : 'Hydrated' }}
              </nuxt-link>
              <!-- Menu Items - Right Aligned -->
              <div class="flex flex-grow justify-end">
                <!-- Mobile menu button -->
                <div class="flex items-center ml-3">
                  <div
                    for="mobile-nav"
                    type="button"
                    class="inline-flex items-center justify-center p-2 rounded-md text-gray-100 hover:text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    aria-controls="mobile-menu"
                    aria-expanded="false"
                    @click="mobileMenuOpen = !mobileMenuOpen"
                  >
                    <span class="sr-only">Open main menu</span>
                    <icon-hamburger
                      v-if="!mobileMenuOpen"
                      class="block h-8 w-8"
                    />
                    <icon-times
                      v-else
                      class="block h-8 w-8"
                    />
                  </div>
                </div>
              </div>
            </div>
            Menu is open
          </div>
        </div>
      </nav>
    </header>
    <main class="py-15" :class="[bg]" class-hint="bg-blue-100 bg-blue-200 bg-blue-300 bg-blue-400 bg-blue-500 bg-blue-600 bg-blue-700 bg-blue-800 bg-blue-900">
      <delay-hydration replay-click>
        <div>
          <span>{{ $isServer ? 'not hydrated' : 'hydrated' }}</span>
          <div class="text-center">
            <button class="bg-orange-600 text-orange-50 rounded-lg p-3" @click="bg = `bg-blue-${(Math.floor(Math.random() * 6) + 1) * 100}`">
              Change background <hydration-status />
            </button>
          </div>
          <div class=" mx-auto container">
            <Nuxt />
          </div>
        </div>
      </delay-hydration>
    </main>
  </div>
</template>
