window.addEventListener('error', (event) => {
  if (event.message?.includes('ResizeObserver loop')) {
    event.stopImmediatePropagation()
  }
})
