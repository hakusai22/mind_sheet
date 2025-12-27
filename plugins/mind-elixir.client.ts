// 在客户端全局导入 mind-elixir 的 CSS
export default defineNuxtPlugin(() => {
  if (import.meta.client) {
    // CSS 会在组件中按需导入
  }
})
