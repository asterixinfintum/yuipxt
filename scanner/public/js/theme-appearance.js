/*!
* Color mode toggler for Bootstrap's docs (https://getbootstrap.com/)
* Copyright 2011-2022 The Bootstrap Authors
* Licensed under the Creative Commons Attribution 3.0 Unported License.
*/

const storedTheme = localStorage.getItem('theme')
const themeCookieName = 'site_auto_theme'

const getSystemTheme = () =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dim' : 'light'

const resolveAppliedTheme = (theme) =>
  theme === 'auto' ? getSystemTheme() : theme

const getCookieValue = (name) => {
  const escapedName = name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
  const match = document.cookie.match(new RegExp(`(?:^|; )${escapedName}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

const setCookieValue = (name, value) => {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/`
}

const setThemeCookie = (theme) => {
  const appliedTheme = resolveAppliedTheme(theme) || 'light'
  setCookieValue(themeCookieName, appliedTheme)
}

if (!getCookieValue(themeCookieName)) {
  setCookieValue(themeCookieName, 'light')
}

const getPreferredTheme = (isOnload = false) => {
  if (storedTheme) {
    return storedTheme
  }

  if(isOnload){
    return 'light';
  }

  return getSystemTheme()
}

const setTheme = function (theme, isChangeFavicon = false) {
  setThemeCookie(theme)

  if(isChangeFavicon){
    let favicon = document.querySelector('link[rel="shortcut icon"]');

    if (favicon) {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches && !favicon.href.includes('light')) {
        favicon.href = favicon.href.replace('favicon', 'favicon-light');
      } else {
        favicon.href = favicon.href.replace('favicon-light', 'favicon');
      }
    }
  }

  document.documentElement.setAttribute('data-bs-theme', resolveAppliedTheme(theme))
}

setTheme(getPreferredTheme(true), true)

const showActiveTheme = theme => {
  const activeThemeIcon = document.querySelector('.theme-icon-active')
  const btnToActive = document.querySelector(`[data-bs-theme-value="${theme}"]`)

  if (!activeThemeIcon || !btnToActive) {
    return;
  }

  const iElement = btnToActive.querySelector('i');

  if (!iElement) {
    return;
  }

  const svgOfActiveBtn = iElement.getAttribute('data-href')

  if (!svgOfActiveBtn) {
      return;
  }

  document.querySelectorAll('[data-bs-theme-value]').forEach(element => {
    element.classList.remove('active')
  })

  btnToActive.classList.add('active')
  activeThemeIcon.classList.remove(activeThemeIcon.getAttribute('data-href').slice(1))
  activeThemeIcon.classList.add(svgOfActiveBtn.slice(1))
  activeThemeIcon.setAttribute('data-href', svgOfActiveBtn)
} 

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (localStorage.getItem('theme') === 'auto') {
    setTheme('auto', true)
  }
})

window.addEventListener('DOMContentLoaded', () => {
  showActiveTheme(getPreferredTheme(true))

  document.querySelectorAll('[data-bs-theme-value]')
    .forEach(toggle => {
      toggle.addEventListener('click', () => {
        const theme = toggle.getAttribute('data-bs-theme-value')
        localStorage.setItem('theme', theme)
        setTheme(theme)
        showActiveTheme(theme)
      })
    })
})
//End Dark Mode