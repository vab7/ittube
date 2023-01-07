const likeIcon = document.querySelectorAll(".like-icon");
const likeValue = document.querySelector(".like-value");

const buttonDislike = document.querySelectorAll(".button-dislike");
const dislikeIcon = document.querySelectorAll(".dislike-icon");
const dislikeValue = document.querySelector(".dislike-value");

const buttonFavorite = document.querySelectorAll(".button-favorite");
const favoriteIcon = document.querySelectorAll(".favorite-icon");

const buttonShare = document.querySelector(".button-share");
const shareIcon = document.querySelector(".share-icon");

const likeI = document.querySelectorAll(".like-i");
const likeIFill = document.querySelectorAll(".like-i-fill");
const dislikeI = document.querySelectorAll(".dislike-i");
const dislikeIFill = document.querySelectorAll(".dislike-i-fill");
const favoriteI = document.querySelectorAll(".favorite-i");
const favoriteCount = document.querySelector('.favorite-count');
const favoriteIFill = document.querySelectorAll(".favorite-i-fill");
const doneIcon = document.querySelector(".done-icon");
const add_boxIcon = document.querySelector(".add_box-icon");
const subIcon = document.querySelectorAll(".sub-icon");

function addVideoLike(csrf_token, video_id) {
   if (dislikeIFill[0].classList.contains("icon-active")) {
      addVideoDislike(csrf_token, video_id);
   }

   if (!isNaN(Number(likeValue.innerHTML))) {
      if (likeI[0].classList.contains("icon-active")) {
         likeValue.innerHTML = Number(likeValue.innerHTML) + 1;
      } else {
         likeValue.innerHTML = Number(likeValue.innerHTML) - 1;
      }
   }

   likeI[0].classList.toggle("icon-active");
   likeIFill[0].classList.toggle("icon-active");
   likeI[1].classList.toggle("icon-active");
   likeIFill[1].classList.toggle("icon-active");

   $.ajax({
      url: "/video/like/",
      type: "post",
      data: {
         video_id: video_id,
         csrfmiddlewaretoken: csrf_token,
      },
      dataType: "json",
      success: function (response) {
         console.log(response.status);
      },
   });

   return false;
}

function addVideoDislike(csrf_token, video_id) {
   if (likeIFill[0].classList.contains("icon-active")) {
      addVideoLike(csrf_token, video_id);
   }

   if (!isNaN(Number(dislikeValue.innerHTML))) {
      if (dislikeI[0].classList.contains("icon-active")) {
         if (typeof Number(dislikeValue.innerHTML) == 'number') {
            dislikeValue.innerHTML = Number(dislikeValue.innerHTML) + 1;
         }
      } else {
         if (typeof Number(favoriteCount.innerHTML) == 'number') {
            dislikeValue.innerHTML = Number(dislikeValue.innerHTML) - 1;
         }
      }
   }

   dislikeI[0].classList.toggle("icon-active");
   dislikeIFill[0].classList.toggle("icon-active");
   dislikeI[1].classList.toggle("icon-active");
   dislikeIFill[1].classList.toggle("icon-active");

   $.ajax({
      url: "/video/dislike/",
      type: "post",
      data: {
         video_id: video_id,
         csrfmiddlewaretoken: csrf_token,
      },
      dataType: "json",
      success: function (response) {
         console.log(response.status);
      },
   });

   return false;
}

function addVideoFavorite(csrf_token, video_id) {
   if (!isNaN(Number(favoriteCount.innerHTML))) {
      if (favoriteI[0].classList.contains("icon-active")) {
         if (typeof Number(favoriteCount.innerHTML) == 'number') {
            favoriteCount.innerHTML = Number(favoriteCount.innerHTML) + 1;
         }
      } else {
         if (typeof Number(favoriteCount.innerHTML) == 'number') {
            favoriteCount.innerHTML = Number(favoriteCount.innerHTML) - 1;
         }
      }
   }

   favoriteI[0].classList.toggle("icon-active");
   favoriteIFill[0].classList.toggle("icon-active");
   favoriteI[1].classList.toggle("icon-active");
   favoriteIFill[1].classList.toggle("icon-active");

   $.ajax({
      url: "/video/favorite/",
      type: "post",
      data: {
         video_id: video_id,
         csrfmiddlewaretoken: csrf_token,
      },
      dataType: "json",
      success: function (response) {
         console.log(response.status);
      },
   });

   return false;
}

const channelActionSubscribeButton = document.querySelector(
   ".channel-action-subscribe-button"
);
const channelInfoMainSubscribersValue = document.querySelector(
   ".channel-info-main-subscribers-value"
);
const subscribeContainer = document.querySelector(".subscribe-container");
let userSubscribesValue = document.querySelector(".user-subscribes-value");

function subscribeUserChannelAction() {
   if (channelActionSubscribeButton.classList.contains("subscribe-active")) {
      channelActionSubscribeButton.innerHTML = "подписаться";
      userSubscribesValue.innerHTML -= 1;
   } else {
      channelActionSubscribeButton.innerHTML = "вы подписаны";
      userSubscribesValue.innerHTML = Number(userSubscribesValue.innerHTML) + 1;
   }
   console.log("cilck");

   doneIcon.classList.toggle("icon-active");
   add_boxIcon.classList.toggle("icon-active");
   channelActionSubscribeButton.classList.toggle("subscribe-active");
}

subIcon[0].addEventListener("click", () => subscribeUserChannelAction());
subIcon[1].addEventListener("click", () => subscribeUserChannelAction());

channelActionSubscribeButton.addEventListener("click", () =>
   subscribeUserChannelAction()
);

function subscribeUserChannel(csrf_token, channel_pk) {
   $.ajax({
      url: "/video/subscribe/channel/",
      type: "post",
      data: {
         csrfmiddlewaretoken: csrf_token,
         channel_pk: channel_pk,
      },
      dataType: "json",
      success: function (response) {
         console.log(response.status);
      },
   });

   return false;
}
