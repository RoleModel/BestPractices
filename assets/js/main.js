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
})
