const menuToggleBurger = document.querySelectorAll(
    "#menu-toggler, #dialog-close-button"
  ),
  menuCloseButton = document.querySelector("#dialog-close-button"),
  mobileMenu = document.querySelector(".dialog-widget");

function toggleMobileMenu() {
  mobileMenu.classList.toggle("open");
}

menuToggleBurger.forEach((item) => {
  item.addEventListener("click", toggleMobileMenu);
});

const tabletMenuToggler = document.querySelector(".elementor-menu-toggle");
const tabletMenu = document.querySelector("#tablet-menu");

tabletMenuToggler.addEventListener("click", () => {
  tabletMenuToggler.classList.toggle("elementor-active");
  if (tabletMenuToggler.classList.value.includes("elementor-active")) {
    tabletMenu.style.setProperty("--menu-height", "100vmax");
  } else {
    tabletMenu.style.setProperty("--menu-height", "0vmax");
  }
});

const aboutDropdownElements = document.querySelectorAll(
  "#about-dropdown-toggler, .elementor-nav-menu--dropdown"
);

aboutDropdownElements.forEach((item) => {
  item.addEventListener("mouseenter", () => {
    aboutDropdownElements[1].classList.add("open");
  });

  item.addEventListener("mouseleave", () => {
    aboutDropdownElements[1].classList.remove("open");
  });
});
