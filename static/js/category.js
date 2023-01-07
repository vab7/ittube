let currentScrollPosition = 0;
let scrollAmount = 320;

const sCont = document.querySelector(".categories-container");
const hScroll = document.querySelector(".horizontal-scroll");

const btnScrollLeft = document.querySelector("#btn-scroll-left");
const btnScrollRight = document.querySelector("#btn-scroll-right");

let maxScroll;

if (sCont && hScroll) {
   maxScroll = -sCont.offsetWidth + hScroll.offsetWidth;
}

function scrollHorizontally(val) {
   currentScrollPosition += val * scrollAmount;

   if (currentScrollPosition >= 0) {
      currentScrollPosition = 0;
      btnScrollLeft.style.opacity = "0";
   } else {
      btnScrollLeft.style.opacity = "1";
   }

   if (currentScrollPosition <= maxScroll) {
      currentScrollPosition = maxScroll;
      btnScrollRight.style.opacity = "0";
   } else {
      btnScrollRight.style.opacity = "1";
   }

   sCont.style.left = currentScrollPosition + "px";
}

const categoryLink = document.querySelectorAll(".category-link");

for (let i = 0; i < categoryLink.length; i++) {
   if (!categoryLink[i].classList.contains("category-active")) {
      categoryLink[i].addEventListener("mousemove", () => {
         categoryLink[i].style.background = "var(--transparent)";
      });
      categoryLink[i].addEventListener("mouseleave", () => {
         categoryLink[i].style.background = "transparent";
      });
   }
}
