declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

import type { Emitter } from 'mitt'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    emitter: Emitter
  }
}
