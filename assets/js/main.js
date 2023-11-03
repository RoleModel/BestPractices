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

  // Anchor Links
  const anchorJS = new AnchorJS() // Imported via CDN
  anchorJS.add('h1:not([itemprop="name headline"]), h2, h3, h4, h5, h6')

  // Table of Contents Scroll
  const article = document.querySelector('.post-body article')
  const anchors = article?.querySelectorAll('h1:not([itemprop="name headline"]), h2, h3, h4, h5, h6')
  const links = document.querySelectorAll('.table-of-contents .table-of-contents__item')

  const appBody = document.querySelector('.app-body')

  appBody.addEventListener('scroll', _event => {
    if (typeof (anchors) != 'undefined' && anchors != null && typeof (links) != 'undefined' && links != null) {
      let scrollTop = appBody.scrollTop;

      // highlight the last scrolled-to: set everything inactive first
      links.forEach((link, index) => {
        link.classList.remove("active");
      })

      // then iterate backwards, on the first match highlight it and break
      for (var i = anchors.length - 1; i >= 0; i--) {
        if (scrollTop > anchors[i].offsetTop - 10) {
          links[i].classList.add('active');
          break;
        }
      }
    }
  })
})
