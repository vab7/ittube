const loaderUlContent = document.querySelector(".loader-container");

function setDuraiton(duration) {
   let result;

   let hours = Math.trunc(duration / 60 / 60);
   let minutes = Math.trunc((duration / 60) % 60);
   let seconds = Math.trunc(duration % 60);

   if (hours) {
      minutes = minutes < 10 ? "0" + minutes : minutes;
   }

   seconds = seconds < 10 ? "0" + seconds : seconds;

   if (hours) {
      result = `${hours}:${minutes}:${seconds}`;
   } else {
      result = `${minutes}:${seconds}`;
   }

   return result;
}

function thumbnailVideo(thumbnailVideo, video, progressTime, step) {
   console.log(step)
   let videoDuration = video.duration;
   let xPercent = 0;

   for (let i = 5; i < videoDuration; i += step) {
      if (progressTime > i) {
         xPercent += 100;
      }
   }

   thumbnailVideo.style.left = `${-xPercent}%`;
}

function defaultThumb(posterWidth) {
   x = 0;
   xPercent = 0;

   for (let i = 0; i < videoList.length; i++) {
      thumbShortContent[i].style.left = `${posterWidth}px`;
   }
}

let thumbnailWidth = 0;
let xPercent = 0;
let x = 0;

function thumbnailVideoSec(thumbnail, thumbnailWidth, posterWidth) {
   x += posterWidth;
   xPercent += 100;

   if (x < thumbnailWidth) {
      thumbnail.style.left = `${-xPercent}%`;
   } else {
      x = 0;
      xPercent = 0;
   }
}

function loadVideoDuration(durationVideo, video) {
   let duration = video.duration;

   if (isNaN(duration)) {
      video.addEventListener("loadedmetadata", () => {
         durationVideo.innerHTML = setDuraiton(video.duration);
      });
   } else {
      durationVideo.innerHTML = setDuraiton(duration);
   }
}

function defaultDur() {
   for (let i = 0; i < videoList.length; i++) {
      durationVideo[i].style.visibility = "visible";
   }
}

var videoList,
   // videoPosterList,
   loaderContentList,
   durationVideo,
   thumbTimeout,
   thumbShortContent;

function videoContentSuggestion() {
   videoList = document.querySelectorAll(".video");
   videoPosterList = document.querySelectorAll(".video-poster");
   videoContainerList = document.querySelectorAll(".video-container");
   var posterWidth = videoList[0].getBoundingClientRect().width;
   durationVideo = document.querySelectorAll(".duration-video");
   thumbShortContent = document.querySelectorAll(".thumb-short-content");

   for (var i = 0; i < videoList.length; i++) {
      thumbShortContent[i].style.left = `${posterWidth}px`;
      videoContainerList[i].style.height = `${(posterWidth * 9) / 16}px`;
      videoPosterList[i].style.height = `${(posterWidth * 9) / 16}px`;
   }

   if (window.screen.width < 991) {
      for (let i = 0; i < videoList.length; i++) {
         videoList[i].addEventListener("touchstart", () => {
            for (let j = 0; j < videoList.length; j++) {
               if (thumbTimeout == undefined) break;
               if (durationVideo[j].style.visibility == "hidden") {
                  if (i != j) {
                     durationVideo[j].style.visibility = "visible";
                     defaultThumb(posterWidth);
                     clearInterval(thumbTimeout);
                     thumbTimeout = undefined;
                  }
               }
            }

            if (thumbTimeout == undefined) {
               durationVideo[i].style.visibility = "hidden";
               thumbTimeout = setInterval(
                  () =>
                     thumbnailVideoSec(
                        thumbShortContent[i],
                        thumbShortContent[i].width,
                        posterWidth
                     ),
                  700
               );
            }
         });
      }
   } else {
      // mouse move poster
      for (let i = 0; i < videoList.length; i++) {
         videoList[i].addEventListener("mousemove", () => {
            durationVideo[i].style.visibility = "hidden";
            if (thumbTimeout == undefined) {
               thumbTimeout = setInterval(
                  () =>
                     thumbnailVideoSec(
                        thumbShortContent[i],
                        thumbShortContent[i].width,
                        posterWidth
                     ),
                  700
               );
            }
         });
         videoList[i].addEventListener("mouseleave", () => {
            defaultThumb(posterWidth);
            clearInterval(thumbTimeout);
            thumbTimeout = undefined;
            durationVideo[i].style.visibility = "visible";
         });
      }
   }
}

videoContentSuggestion();

// lazy loading suggestions
let infinite = new Waypoint.Infinite({
   element: $(".infinite-container")[0],
   offset: "bottom-in-view",
   onBeforePageLoad: function () {
      loaderUlContent.style.display = "flex";
   },
   onAfterPageLoad: function () {
      loadedData();
      loaderUlContent.style.display = "none";
   },
});

function loadedData() {
   videoContentSuggestion();
   images = document.getElementsByTagName("img");
   for (let i = 0; i < images.length; i++) {
      changeDataSrcToSrc(images[i]);
   }

   function changeDataSrcToSrc(img) {
      console.log(img);
      img.style.display = "block";
   }
}
