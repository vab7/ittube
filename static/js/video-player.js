const video_player = document.querySelector("#video_player"),
   mainVideo = video_player.querySelector("#main-video"),
   progressAreaTime = video_player.querySelector(".progressAreaTime"),
   controls = video_player.querySelector(".controls"),
   progressArea = video_player.querySelector(".progress-area"),
   bufferedBar = video_player.querySelector(".bufferedBar"),
   progress_Bar = video_player.querySelector(".progress-bar"),
   keyboard_double_arrow_left = video_player.querySelector(
      ".keyboard_double_arrow_left"
   ),
   play_pause = video_player.querySelector(".play_pause"),
   keyboard_double_arrow_right = video_player.querySelector(
      ".keyboard_double_arrow_right"
   ),
   volume = video_player.querySelector(".volume"),
   volume_range = video_player.querySelector(".volume_range"),
   current = video_player.querySelector(".current"),
   totalDuration = video_player.querySelector(".duration"),
   settingsBtn = video_player.querySelector(".settingsBtn"),
   picture_in_picutre = video_player.querySelector(".picture_in_picutre"),
   fullscreen = video_player.querySelector(".fullscreen"),
   fullscreen_svg = video_player.querySelector(".fullscreen-svg"),
   fullscreen_exit_svg = video_player.querySelector(".fullscreen-exit-svg"),
   settings = video_player.querySelector("#settings"),
   settings_icon = video_player.querySelector(".settings-icon"),
   settings_icon_fill = video_player.querySelector(".settings-icon-fill"),
   settingHome = video_player.querySelectorAll(
      "#settings [data-label='settingHome'] > ul > li"
   ),
   playback = video_player.querySelectorAll(".playback li"),
   tracks = video_player.querySelectorAll("track"),
   loader = video_player.querySelector(".loader"),
   pauseScreen = video_player.querySelector(".pause-screen"),
   playPauseMain = video_player.querySelector(".play_pause_main"),
   playIconMain = video_player.querySelector(".play-icon-main"),
   pauseIconMain = video_player.querySelector(".pause-icon-main"),
   playIconLit = video_player.querySelector(".play-icon-lit"),
   pauseIconLit = video_player.querySelector(".pause-icon-lit"),
   arrow_left = video_player.querySelector(".arrow_left"),
   arrow_right = video_player.querySelector(".arrow_right"),
   progressAreaContainer = video_player.querySelector(
      ".progress-area-container"
   ),
   volume_up = video_player.querySelector(".volume_up"),
   volume_off = video_player.querySelector(".volume_off"),
   video_double_arrow_left = video_player.querySelector(
      ".video_double_arrow_left"
   ),
   video_double_arrow_right = video_player.querySelector(
      ".video_double_arrow_right"
   ),
   arrowStyleLeft = video_player.querySelector(".arrow-style-left"),
   arrowStyleRight = video_player.querySelector(".arrow-style-right"),
   thumbnailContainer = video_player.querySelector(".thumbnail-container"),
   blackScreen = video_player.querySelector(".black-screen"),
   thumbnailVideoMain = video_player.querySelector(".thumbnail-video"),
   progressBarSpan = video_player.querySelector(".progress-bar span"),
   thumb_up = video_player.querySelector(".thumb_up"),
   thumb_down = video_player.querySelector(".thumb_down"),
   favorite = video_player.querySelector(".favorite"),
   share = video_player.querySelector(".share"),
   thumb_full = video_player.querySelector('.thumbnail-video');

const fieldCommentInput = document.querySelector(".field-comment-input");

let thumbPath = thumb_full.getAttribute('src');
let step_str = thumbPath.split('_').slice(-1)[0].split('.')[0];
let step = Number(step_str);
// let step = 5

// Play video function
function playVideo() {
   // play_pause.innerHTML = "pause";
   play_pause.title = "pause";
   video_player.classList.add("paused");

   // playPauseMain.innerHTML = "pause";
   playIconMain.style.display = "none";
   pauseIconMain.style.display = "block";

   playIconLit.style.display = "none";
   pauseIconLit.style.display = "block";

   playPauseMain.title = "pause";

   // playPauseMain.style.fontVariationSettings = '"FILL" 0, "wght" 100';
   // play_pause.style.fontVariationSettings = '"FILL" 0, "wght" 100';

   mainVideo.play();
}

// Pause video function
function pauseVideo() {
   // play_pause.innerHTML = "play_arrow";
   play_pause.title = "play";
   video_player.classList.remove("paused");

   // playPauseMain.innerHTML = "play_arrow";
   playIconMain.style.display = "block";
   pauseIconMain.style.display = "none";

   playIconLit.style.display = "block";
   pauseIconLit.style.display = "none";

   playPauseMain.title = "play_arrow";

   // playPauseMain.style.fontVariationSettings = '"FILL" 1, "wght" 300';
   // play_pause.style.fontVariationSettings = '"FILL" 1, "wght" 300';

   mainVideo.pause();
}

// set duration
loadVideoDuration(totalDuration, mainVideo);

// Load video duration
mainVideo.addEventListener("loadeddata", (e) => {
   let videoDuration = e.target.duration;
   let totalMin = Math.floor(videoDuration / 60);
   let totalSec = Math.floor(videoDuration % 60);

   // if seconds are less then 10 then add 0 at the begning
   totalSec < 10 ? (totalSec = "0" + totalSec) : totalSec;
   totalDuration.innerHTML = `${totalMin}:${totalSec}`;
});

// Current video duration
mainVideo.addEventListener("timeupdate", (e) => {
   let currentVideoTime = e.target.currentTime;
   let currentMin = Math.floor(currentVideoTime / 60);
   let currentSec = Math.floor(currentVideoTime % 60);

   // if seconds are less then 10 then add 0 at the begning
   currentSec < 10 ? (currentSec = "0" + currentSec) : currentSec;
   current.innerHTML = `${currentMin}:${currentSec}`;

   let videoDuration = e.target.duration;
   // progressBar width change
   let progressWidth = (currentVideoTime / videoDuration) * 100 + 0.5;

   progress_Bar.style.width = `${progressWidth}%`;
});

// progress bar
function drawProgress(canvas, buffered, duration) {
   let context = canvas.getContext("2d", { antialias: false });
   context.fillStyle = "#ffffffe6";

   let height = canvas.height;
   let width = canvas.width;
   if (!height || !width) throw "Canva's width or height or not set.";
   context.clearRect(0, 0, width, height);
   for (let i = 0; i < buffered.length; i++) {
      let leadingEdge = (buffered.start(i) / duration) * width;
      let trailingEdge = (buffered.end(i) / duration) * width;
      context.fillRect(leadingEdge, 0, trailingEdge - leadingEdge, height);
   }
}
mainVideo.addEventListener("progress", () => {
   drawProgress(bufferedBar, mainVideo.buffered, mainVideo.duration);
});
mainVideo.addEventListener("waiting", () => {
   loader.style.display = "block";
});
mainVideo.addEventListener("canplay", () => {
   loader.style.display = "none";
});

// Playback Rate
playback.forEach((event) => {
   event.addEventListener("click", () => {
      removeActiveClasses(playback);
      event.classList.add("active");
      let speed = event.getAttribute("data-speed");
      mainVideo.playbackRate = speed;
   });
});

const settingDivs = video_player.querySelectorAll("#settings > div");
const settingBack = video_player.querySelectorAll(
   "#settings > div .back_arrow"
);
const quality_ul = video_player.querySelector(
   "#settings > [data-label='quality'] ul"
);
const qualities = video_player.querySelectorAll("source[size]");

qualities.forEach((event) => {
   let quality_html = `<li data-quality="${event.getAttribute(
      "size"
   )}">${event.getAttribute("size")}p</li>`;
   quality_ul.insertAdjacentHTML("afterbegin", quality_html);
});

const quality_li = video_player.querySelectorAll(
   "#settings > [data-label='quality'] ul > li"
);

settingHome.forEach((event) => {
   event.addEventListener("click", (e) => {
      let setting_label = e.target.getAttribute("data-label");
      for (let i = 0; i < settingDivs.length; i++) {
         if (settingDivs[i].getAttribute("data-label") == setting_label) {
            settingDivs[i].removeAttribute("hidden");
         } else {
            settingDivs[i].setAttribute("hidden", "");
         }
      }
   });
});

function removeActiveClasses(e) {
   e.forEach((event) => {
      event.classList.remove("active");
   });
}

// settings back
settingBack.forEach((event) => {
   event.addEventListener("click", (e) => {
      let setting_label = e.target.getAttribute("data-label");
      console.log(setting_label);
      for (let i = 0; i < settingDivs.length; i++) {
         if (settingDivs[i].getAttribute("data-label") == setting_label) {
            settingDivs[i].removeAttribute("hidden");
         } else {
            settingDivs[i].setAttribute("hidden", "");
         }
      }
   });
});

// qualiti li
quality_li.forEach((event) => {
   event.addEventListener("click", (e) => {
      let quality = event.getAttribute("data-quality");
      removeActiveClasses(quality_li);
      event.classList.add("active");
      qualities.forEach((event) => {
         if (event.getAttribute("size") == quality) {
            let video_current_duration = mainVideo.currentTime;
            let video_source = event.getAttribute("src");
            mainVideo.src = video_source;
            mainVideo.currentTime = video_current_duration;
         }
      });
   });
});

// progress bar
function setTimelinePosition(e) {
   let videoDuration = mainVideo.duration;
   let progressWidthval = progressArea.clientWidth;
   let ClickOffsetX = e.offsetX;
   mainVideo.currentTime = (ClickOffsetX / progressWidthval) * videoDuration;

   let progressWidth = (mainVideo.currentTime / videoDuration) * 100 + 0.5;
   let x = e.offsetX;

   progress_Bar.style.width = `${progressWidth}%`;

   let currentVideoTime = mainVideo.currentTime;
   let currentMin = Math.floor(currentVideoTime / 60);
   let currentSec = Math.floor(currentVideoTime % 60);

   // if seconds are less then 10 then add 0 at the begning
   currentMin < 10 ? (currentMin = "0" + currentMin) : currentMin;
   current.innerHTML = `${currentMin}:${currentSec}`;

   let progressTime = Math.floor((x / progressWidthval) * videoDuration);

   thumbnailVideo(thumbnailVideoMain, mainVideo, progressTime, step);

   if (x >= progressWidthval - 90) {
      x = progressWidthval - 90;
   } else if (x <= 90) {
      x = 90;
   } else {
      x = e.offsetX;
   }

   // if seconds are less then 10 then add 0 at the begning
   currentSec < 10 ? (currentSec = "0" + currentSec) : currentSec;
   progressAreaTime.innerHTML = `${currentMin} : ${currentSec}`;

   thumbnailContainer.style.setProperty("--x", `${x}px`);
}

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

if (window.screen.width < 991) {
   const animationDoubleArrow = (arrow) => {
      arrow.style.opacity = "0";
   };

   const timerCloseControls = () => {
      controls.style.visibility = "hidden";
      controls.style.opacity = 0;

      progressBarSpan.style.width = "0px";
      progressBarSpan.style.height = "0px";
      progressBarSpan.style.right = "0px";

      if (screen.orientation.type == "landscape-primary") {
         progressAreaContainer.style.opacity = 0;
      }
   };

   const timeCloseControls = 3000;

   let closeControlsBool = false;

   let timerControls;
   let closeControls;

   var second = (showControls) => {
      if (showControls) {
         controls.style.visibility = "visible";
         controls.style.opacity = 1;

         progressAreaContainer.style.opacity = 1;
         progressAreaContainer.style.visibility = "visible";

         progressBarSpan.style.width = "14px";
         progressBarSpan.style.height = "14px";
         progressBarSpan.style.right = "-5px";

         if (play_pause.title == "pause") {
            closeControlsBool = true;
            closeControls = setTimeout(timerCloseControls, timeCloseControls);
         }
      } else {
         closeControlsBool = false;
         clearTimeout(closeControls);

         controls.style.visibility = "hidden";
         controls.style.opacity = 0;
         progressBarSpan.style.right = "0px";

         progressBarSpan.style.width = "0px";
         progressBarSpan.style.height = "0px";

         if (screen.orientation.type == "landscape-primary") {
            progressAreaContainer.style.opacity = 0;
            progressAreaContainer.style.visibility = "hidden";
         }
      }
   };

   let lastClick = 0;
   const time_between_taps = 200;

   function double_arrow(e, bool, arrow, showControls) {
      e.preventDefault();

      let date = new Date();
      let time = date.getTime();

      if (
         playPauseMain.title == "pause" &&
         !video_player.classList.contains("paused")
      ) {
         video_player.classList.remove("paused");
         playPauseMain.title = "play_arrow";
         play_pause.title = "play_arrow";

         // playPauseMain.style.fontVariationSettings = '"FILL" 1, "wght" 300';
         // play_pause.style.fontVariationSettings = '"FILL" 1, "wght" 300';
      }

      if (settings.classList.contains("active")) {
         for (let i = 0; i < settingDivs.length; i++) {
            if (settingDivs[i].getAttribute("data-label") == "settingHome") {
               settingDivs[i].removeAttribute("hidden");
            } else {
               settingDivs[i].setAttribute("hidden", "");
            }
         }

         settings.classList.toggle("active");
         settingsBtn.classList.toggle("active");

         if (settings.classList.contains("active")) {
            settings_icon.style.display = "none";
            settings_icon_fill.style.display = "block";
         } else {
            settings_icon.style.display = "block";
            settings_icon_fill.style.display = "none";
         }

         settingsBtn.classList.toggle("active-settings-btn");

         closeControls = setTimeout(timerCloseControls, timeCloseControls);
      } else {
         if (time - lastClick < time_between_taps) {
            if (bool) {
               mainVideo.currentTime += 10;
            } else {
               mainVideo.currentTime -= 10;
            }

            clearTimeout(timerControls);
            arrow.style.opacity = "1";
            setTimeout(animationDoubleArrow, 700, arrow);
         } else {
            timerControls = setTimeout(second, 200, showControls);
         }
      }

      lastClick = time;
   }

   // double_arrow
   video_double_arrow_left.addEventListener("touchstart", (e) =>
      double_arrow(e, false, arrowStyleLeft, true)
   );
   video_double_arrow_right.addEventListener("touchstart", (e) =>
      double_arrow(e, true, arrowStyleRight, true)
   );
   keyboard_double_arrow_left.addEventListener("touchstart", (e) =>
      double_arrow(e, false, arrowStyleLeft, false)
   );
   keyboard_double_arrow_right.addEventListener("touchstart", (e) =>
      double_arrow(e, true, arrowStyleRight, false)
   );

   // touch settings
   settingsBtn.addEventListener("click", () => {
      settings.classList.toggle("active");
      settingsBtn.classList.toggle("active");

      settingsBtn.classList.toggle("active-settings-btn");

      if (settings.classList.contains("active")) {
         settings_icon.style.display = "none";
         settings_icon_fill.style.display = "block";
      } else {
         settings_icon.style.display = "block";
         settings_icon_fill.style.display = "none";
      }

      closeControlsBool = false;
      clearTimeout(closeControls);
   });

   // touch play pause
   playPauseMain.addEventListener("click", () => {
      const isVideoPaused = video_player.classList.contains("paused");

      if (settings.classList.contains("active")) {
         settings.classList.toggle("active");
         settingsBtn.classList.toggle("active");

         if (settings.classList.contains("active")) {
            settings_icon.style.display = "none";
            settings_icon_fill.style.display = "block";
         } else {
            settings_icon.style.display = "block";
            settings_icon_fill.style.display = "none";
         }

         settingsBtn.classList.toggle("active-settings-btn");
      } else {
         if (isVideoPaused) {
            pauseVideo();

            closeControlsBool = false;
            clearTimeout(closeControls);
         } else {
            playVideo();

            closeControlsBool = true;
            closeControls = setTimeout(timerCloseControls, timeCloseControls);
         }
      }
   });

   const fullscreenActive = () => {
      screen.orientation.lock("landscape-primary");
   };

   // fullscreen change icon
   let fullscreenChange = false;
   window.addEventListener("fullscreenchange", () => {
      if (fullscreenChange) {
         video_player.classList.remove("openFullScreen");
         thumbnailContainer.style.setProperty("--x", `0px`);

         fullscreen_svg.style.display = "block";
         fullscreen_exit_svg.style.display = "none";

         if (controls.style.visibility == "hidden") {
            console.log("active");

            progressAreaContainer.style.visibility = "visible";
            progressAreaContainer.style.opacity = 1;
         }
      }
      fullscreenChange = true;
   });

   // Full screen function
   fullscreen.addEventListener("click", () => {
      if (!video_player.classList.contains("openFullScreen")) {
         video_player.classList.add("openFullScreen");

         fullscreen_svg.style.display = "none";
         fullscreen_exit_svg.style.display = "block";

         video_player.requestFullscreen();

         fullscreenChange = false;

         setTimeout(fullscreenActive, 120);
      } else {
         video_player.classList.remove("openFullScreen");

         fullscreen_svg.style.display = "block";
         fullscreen_exit_svg.style.display = "none";

         document.exitFullscreen();
      }
   });

   // touch video
   mainVideo.addEventListener("touchstart", () => {
      clearTimeout(timer);
      hideControls();

      if (mainVideo.classList.contains("active-controls")) {
         if (play_pause.title == "play_arrow") {
            playVideo();
         } else {
            pauseVideo();
         }
      } else {
         mainVideo.classList.add("active-controls");
         controls.classList.add("active");
      }
   });

   progressAreaContainer.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      if (controls.style.visibility == "visible") {
         controls.style.visibility = "hidden";
         controls.style.opacity = 0;

         controlsHidden = false;

         closeControlsBool = true;
         clearTimeout(closeControls);
      }

      if (settings.classList.contains("active")) {
         for (let i = 0; i < settingDivs.length; i++) {
            if (settingDivs[i].getAttribute("data-label") == "settingHome") {
               settingDivs[i].removeAttribute("hidden");
            } else {
               settingDivs[i].setAttribute("hidden", "");
            }
         }

         settings.classList.toggle("active");
         settingsBtn.classList.toggle("active");

         if (settings.classList.contains("active")) {
            settings_icon.style.display = "none";
            settings_icon_fill.style.display = "block";
         } else {
            settings_icon.style.display = "block";
            settings_icon_fill.style.display = "none";
         }

         settingsBtn.classList.toggle("active-settings-btn");
      }

      thumbnailContainer.style.visibility = "visible";
      thumbnailContainer.style.opacity = 1;

      progressBarSpan.style.width = "14px";
      progressBarSpan.style.height = "14px";
      progressBarSpan.style.right = "-5px";

      blackScreen.style.visibility = "visible";
      blackScreen.style.opacity = 1;

      progressAreaContainer.setPointerCapture(e.pointerId);
      setTimelinePosition(e);
      progressAreaContainer.addEventListener("pointermove", (e) => {
         setTimelinePosition(e);
      });
      progressAreaContainer.addEventListener("pointerup", () => {
         progressAreaContainer.removeEventListener(
            "pointermove",
            setTimelinePosition
         );

         thumbnailContainer.style.visibility = "hidden";
         thumbnailContainer.style.opacity = 0;

         blackScreen.style.visibility = "hidden";
         blackScreen.style.opacity = 0;

         controls.style.visibility = "visible";
         controls.style.opacity = 1;

         closeControlsBool = true;
         clearTimeout(closeControls);

         const isVideoPaused = video_player.classList.contains("paused");
         if (isVideoPaused) {
            closeControlsBool = true;
            closeControls = setTimeout(timerCloseControls, timeCloseControls);
         }
      });
   });

   // action button like, dislike, favorite, share
   // thumb_up.addEventListener("click", () => {
   //    if (thumb_down.classList.contains("active-icon")) {
   //       thumb_up.classList.toggle("active-icon");
   //       thumb_down.classList.toggle("active-icon");
   //    } else {
   //       thumb_up.classList.toggle("active-icon");
   //    }
   // });
   // thumb_down.addEventListener("click", () => {
   //    if (thumb_up.classList.contains("active-icon")) {
   //       thumb_up.classList.toggle("active-icon");
   //       thumb_down.classList.toggle("active-icon");
   //    } else {
   //       thumb_down.classList.toggle("active-icon");
   //    }
   // });
   // favorite.addEventListener("click", () => {
   //    favorite.classList.toggle("active-icon");
   // });
   // share.addEventListener("click", () => {
   //    share.classList.toggle("active-icon");
   // });

   // action subscribe
} else {
   let closeControlsTimer;

   const closeControlsFullscreen = () => {
      controls.style.visibility = "hidden";
      controls.style.opacity = 0;

      controls.style.cursor = "none";

      progressAreaContainer.style.visibility = "hidden";
      progressAreaContainer.style.opacity = 0;
   };

   // if (e.code == "Space") {
   //    e.preventDefault();
   //    const isVideoPaused = video_player.classList.contains("paused");

   //    if (isVideoPaused) {
   //       pauseVideo();

   //       controls.style.visibility = "visible";
   //       controls.style.opacity = 1;

   //       controls.style.cursor = "auto";

   //       progressAreaContainer.style.visibility = "visible";
   //       progressAreaContainer.style.opacity = 1;
   //    } else {
   //       playVideo();

   //       clearTimeout(closeControlsTimer);
   //       closeControlsTimer = setTimeout(closeControlsFullscreen, 3000);
   //    }
   // }

   // show controls
   video_player.addEventListener("mousemove", () => {
      clearTimeout(closeControlsTimer);

      if (playPauseMain.title == "pause") {
         controls.style.visibility = "visible";
         controls.style.opacity = 1;

         controls.style.cursor = "auto";

         progressAreaContainer.style.visibility = "visible";
         progressAreaContainer.style.opacity = 1;

         clearTimeout(closeControlsTimer);
         closeControlsTimer = setTimeout(closeControlsFullscreen, 3000);
      }

      if (playPauseMain.title == "") {
         playPauseMain.title = "pause";
         playIconMain.style.display = "block";
         pauseIconMain.style.display = "none";

         // playPauseMain.innerHTML = "play_arrow";
         play_pause.title = "play_arrow";

         video_player.classList.remove("paused");

         // playPauseMain.style.fontVariationSettings = '"FILL" 1, "wght" 300';
         // play_pause.style.fontVariationSettings = '"FILL" 1, "wght" 300';
      }
   });
   video_player.addEventListener("mouseleave", () => {
      clearTimeout(closeControlsTimer);

      if (playPauseMain.title == "pause") {
         controls.style.visibility = "hidden";
         controls.style.opacity = 0;
         progressAreaContainer.style.opacity = 0;
      }

      if (settingsBtn.classList.contains("active")) {
         for (let i = 0; i < settingDivs.length; i++) {
            if (settingDivs[i].getAttribute("data-label") == "settingHome") {
               settingDivs[i].removeAttribute("hidden");
            } else {
               settingDivs[i].setAttribute("hidden", "");
            }
         }

         settings.classList.toggle("active");
         settingsBtn.classList.toggle("active");

         if (settings.classList.contains("active")) {
            settings_icon.style.display = "none";
            settings_icon_fill.style.display = "block";
         } else {
            settings_icon.style.display = "block";
            settings_icon_fill.style.display = "none";
         }

         settingsBtn.classList.toggle("active-settings-btn");
      }
   });

   // click button play_pause
   play_pause.addEventListener("click", () => {
      const isVideoPaused = video_player.classList.contains("paused");
      isVideoPaused ? pauseVideo() : playVideo();
   });
   playPauseMain.addEventListener("click", () => {
      const isVideoPaused = video_player.classList.contains("paused");
      isVideoPaused ? pauseVideo() : playVideo();
   });
   pauseScreen.addEventListener("click", () => {
      if (settings.classList.contains("active")) {
         for (let i = 0; i < settingDivs.length; i++) {
            if (settingDivs[i].getAttribute("data-label") == "settingHome") {
               settingDivs[i].removeAttribute("hidden");
            } else {
               settingDivs[i].setAttribute("hidden", "");
            }
         }

         settings.classList.toggle("active");
         settingsBtn.classList.toggle("active");

         if (settings.classList.contains("active")) {
            settings_icon.style.display = "none";
            settings_icon_fill.style.display = "block";
         } else {
            settings_icon.style.display = "block";
            settings_icon_fill.style.display = "none";
         }

         settingsBtn.classList.toggle("active-settings-btn");
      } else {
         clearTimeout(closeControlsTimer);

         const isVideoPaused = video_player.classList.contains("paused");
         isVideoPaused ? pauseVideo() : playVideo();
      }
   });
   mainVideo.addEventListener("play", () => {
      playVideo();
   });
   mainVideo.addEventListener("pause", () => {
      pauseVideo();
   });

   // open fullscreen
   function openFullscreen() {
      if (!video_player.classList.contains("openFullScreen")) {
         video_player.classList.add("openFullScreen");

         fullscreen_svg.style.display = "none";
         fullscreen_exit_svg.style.display = "block";

         video_player.requestFullscreen();
      } else {
         video_player.classList.remove("openFullScreen");

         fullscreen_svg.style.display = "block";
         fullscreen_exit_svg.style.display = "none";

         document.exitFullscreen();
      }
   }

   // fullscreen doubleclick
   pauseScreen.addEventListener("dblclick", openFullscreen);

   // fullscreen button
   fullscreen.addEventListener("click", openFullscreen);

   // touch settings button
   settingsBtn.addEventListener("click", (e) => {
      settings.classList.toggle("active");
      settingsBtn.classList.toggle("active");

      if (settings.classList.contains("active")) {
         settings_icon.style.display = "none";
         settings_icon_fill.style.display = "block";
      } else {
         settings_icon.style.display = "block";
         settings_icon_fill.style.display = "none";
      }

      settingsBtn.classList.toggle("active-settings-btn");
   });

   // Update progress area time and display block on mouse move
   progressAreaContainer.addEventListener("mousemove", (e) => {
      let progressWidthval = progressArea.clientWidth + 2;
      let x = e.offsetX;
      let videoDuration = mainVideo.duration;
      let progressTime = Math.floor((x / progressWidthval) * videoDuration);
      let currentMin = Math.floor(progressTime / 60);
      let currentSec = Math.floor(progressTime % 60);
      progressAreaTime.style.setProperty("--x", `${x}px`);
      progressAreaTime.style.display = "block";
      if (x >= progressWidthval - 90) {
         x = progressWidthval - 90;
      } else if (x <= 90) {
         x = 90;
      } else {
         x = e.offsetX;
      }

      thumbnailVideo(thumbnailVideoMain, mainVideo, progressTime, step);

      // if seconds are less then 10 then add 0 at the begning
      currentSec < 10 ? (currentSec = "0" + currentSec) : currentSec;
      progressAreaTime.innerHTML = `${currentMin}:${currentSec}`;

      thumbnailContainer.style.setProperty("--x", `${x}px`);
      thumbnailContainer.style.visibility = "visible";
      thumbnailContainer.style.opacity = 1;
   });

   progressAreaContainer.addEventListener("mouseleave", () => {
      thumbnailContainer.style.visibility = "hidden";
      thumbnailContainer.style.opacity = 0;
   });

   progressAreaContainer.addEventListener("pointerdown", (e) => {
      progressAreaContainer.setPointerCapture(e.pointerId);
      setTimelinePosition(e);
      progressAreaContainer.addEventListener(
         "pointermove",
         setTimelinePosition
      );
      progressAreaContainer.addEventListener("pointerup", () => {
         progressAreaContainer.removeEventListener(
            "pointermove",
            setTimelinePosition
         );
      });
   });

   // change volume
   function changeVolume() {
      mainVideo.volume = volume_range.value / 100;
      if (volume_range.value == 0) {
         volume_off.style.display = "block";
         volume_up.style.display = "none";
      } else {
         volume_up.style.display = "block";
         volume_off.style.display = "none";
      }
   }

   function muteVolume() {
      if (volume_range.value == 0) {
         volume_range.value = 50;
         mainVideo.volume = 0.5;
         volume_up.style.display = "block";
         volume_off.style.display = "none";
      } else {
         volume_range.value = 0;
         mainVideo.volume = 0;
         volume_up.style.display = "none";
         volume_off.style.display = "block";
      }
   }

   function handleInputChange(e) {
      volume_range.style.transition = "none";

      let target = e.target;
      if (e.target.type !== "range") {
         target = document.getElementById("range");
      }
      const min = target.min;
      const max = target.max;
      const val = target.value;

      target.style.backgroundSize =
         ((val - min) * 100) / (max - min) + "% 100%";
   }

   volume_range.addEventListener("input", (e) => {
      changeVolume();

      handleInputChange(e);
   });

   volume_range.addEventListener("mouseup", () => {
      volume_range.style.transition = "all 0.3s";
   });

   volume.addEventListener("click", () => {
      muteVolume();
   });

   // keyboard event
   const arrowLeftKey = function (e) {
      if (e.code == "ArrowLeft") {
         mainVideo.currentTime -= 10;
      }
   };

   const arrowRightKey = function (e) {
      if (e.code == "ArrowRight") {
         mainVideo.currentTime += 10;
      }
   };

   const spaceKey = function (e) {
      if (e.code == "Space") {
         e.preventDefault();
         const isVideoPaused = video_player.classList.contains("paused");

         if (isVideoPaused) {
            pauseVideo();

            controls.style.visibility = "visible";
            controls.style.opacity = 1;

            controls.style.cursor = "auto";

            progressAreaContainer.style.visibility = "visible";
            progressAreaContainer.style.opacity = 1;
         } else {
            playVideo();

            clearTimeout(closeControlsTimer);
            closeControlsTimer = setTimeout(closeControlsFullscreen, 3000);
         }
      }
   };

   document.addEventListener("keydown", arrowLeftKey);
   document.addEventListener("keydown", arrowRightKey);
   document.addEventListener("keydown", spaceKey);

   fieldCommentInput.addEventListener("focusin", () => {
      document.removeEventListener("keydown", arrowLeftKey);
      document.removeEventListener("keydown", arrowRightKey);
      document.removeEventListener("keydown", spaceKey);
   });
   fieldCommentInput.addEventListener("focusout", () => {
      document.addEventListener("keydown", arrowLeftKey);
      document.addEventListener("keydown", arrowRightKey);
      document.addEventListener("keydown", spaceKey);
   });
}
