// menu

let buttonMenu = document.querySelector(".button-menu");
let buttonCloseMenu = document.querySelector(".button-close-menu");
let menu = document.querySelector(".menu-nav");
let overlay = document.querySelector(".container-overlay");

buttonMenu.addEventListener("click", () => {
   menu.classList.add("menu-visible");
   menu.classList.remove("menu-hidden");

   overlay.classList.add("overlay-visible");
   overlay.classList.remove("overlay-hidden");
});

buttonCloseMenu.addEventListener("click", () => {
   menu.classList.add("menu-hidden");
   menu.classList.remove("menu-visible");

   overlay.classList.add("overlay-hidden");
   overlay.classList.remove("overlay-visible");
});

overlay.addEventListener("click", () => {
   menu.classList.add("menu-hidden");
   menu.classList.remove("menu-visible");

   overlay.classList.add("overlay-hidden");
   overlay.classList.remove("overlay-visible");
});

// search

let searchInput = document.querySelector(".search-input");
let searchButton = document.querySelector(".search-button-permission");
let logoIcon = document.querySelector(".logo-icon");
let buttonCloseSearch = document.querySelector(".button-cancel-search");
let search = document.querySelector(".search");
let inputCloseIcon = document.querySelector(".input-close-icon");
let headerRight = document.querySelector('.header-right')
// let container = document.querySelector('.header-top .container')

searchButton.addEventListener("click", () => {
   headerRight.classList.toggle('search-visible')

   // container.style.padding = ''

   searchInput.classList.add("search-input-visible");
   searchInput.classList.remove("search-input-hidden");

   search.classList.add("search-visible");
   search.classList.remove("search-hidden");

   searchInput.focus();

   searchButton.classList.add("hidden");
   searchButton.classList.remove("visible");

   logoIcon.classList.add("hidden");
   logoIcon.classList.remove("visible");

   buttonMenu.classList.add("hidden");
   buttonMenu.classList.remove("visible");

   buttonCloseSearch.classList.add("visible");
   buttonCloseSearch.classList.remove("hidden");
});

buttonCloseSearch.addEventListener("click", () => {
   headerRight.classList.toggle('search-visible')

   searchInput.classList.add("search-input-hidden");
   searchInput.classList.remove("search-input-visible");

   search.classList.add("search-hidden");
   search.classList.remove("search-visible");

   logoIcon.classList.add("visible");
   logoIcon.classList.remove("hidden");

   searchInput.value = "";

   searchButton.classList.add("visible");
   searchButton.classList.remove("hidden");

   buttonMenu.classList.add("visible");
   buttonMenu.classList.remove("hidden");

   buttonCloseSearch.classList.add("hidden");
   buttonCloseSearch.classList.remove("visible");
});

inputCloseIcon.addEventListener("click", () => {
   searchInput.value = "";
});
