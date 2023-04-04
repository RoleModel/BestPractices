document.addEventListener("DOMContentLoaded", () => {
  // Mobile Menu

  document.getElementById("app-body").addEventListener('click', () => {
    const menu = document.getElementById("sidebar-menu")
    if ([...menu.classList].includes('sidebar--open')) {
      menu.classList.remove('sidebar--open')
    }
  })

  document.querySelectorAll('.sidebar-menu-button').forEach(button => {
    button.addEventListener('click', () => {
      setTimeout(() => {
        const menu = document.getElementById("sidebar-menu")
        menu.classList.toggle('sidebar--open')
      }, 1)
    })
  })

  // Copy Button

  const codeBlocks = document.querySelectorAll('div.highlighter-rouge, div.listingblock > div.content, figure.highlight')
  const copyHtml = '<span class="material-symbols-outlined">content_copy</span>'
  const copiedHtml = '<span class="material-symbols-outlined">check</span>'

  codeBlocks.forEach(codeBlock => {
    const copyButton = document.createElement('button')
    let timeout = null
    copyButton.type = 'button'
    copyButton.classList = 'btn-secondary btn--no-border btn--small btn--icon btn--copy'
    copyButton.ariaLabel = 'Copy code to clipboard'
    copyButton.innerHTML = copyHtml
    codeBlock.prepend(copyButton)

    copyButton.addEventListener('click', function () {
      if(timeout === null) {
        const code = (codeBlock.querySelector('pre:not(.lineno, .highlight)') || codeBlock.querySelector('code')).innerText
        window.navigator.clipboard.writeText(code)

        copyButton.innerHTML = copiedHtml

        timeout = setTimeout(function () {
          copyButton.innerHTML = copyHtml
          timeout = null
        }, 4000)
      }
    })
  })
})
