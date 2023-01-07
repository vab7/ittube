const channelMainActionSubscribeButton = document.querySelector(
   ".channel-main-action-subscribe-button"
);
const userSubscribesValueChannel = document.querySelector(
   ".user-subscribes-value"
);
const showInfoChannelText = document.querySelector(".show-info-channel-text");
const channelInfoShowContainer = document.querySelector(
   ".channel-info-show-container"
);

function subscribeUserMainChannelAction() {
   if (
      channelMainActionSubscribeButton.classList.contains("subscribe-active")
   ) {
      channelMainActionSubscribeButton.innerHTML = "подписаться";
      userSubscribesValueChannel.innerHTML -= 1;
   } else {
      channelMainActionSubscribeButton.innerHTML = "вы подписаны";
      userSubscribesValueChannel.innerHTML =
         Number(userSubscribesValueChannel.innerHTML) + 1;
   }

   channelMainActionSubscribeButton.classList.toggle("subscribe-active");
}

channelMainActionSubscribeButton.addEventListener(
   "click",
   subscribeUserMainChannelAction
);

function showHideAboutChannel() {
   if (showInfoChannelText.classList.contains("show-channel-about")) {
      showInfoChannelText.innerHTML = "показать описание";
   } else {
      showInfoChannelText.innerHTML = "скрыть описание";
   }

   channelInfoShowContainer.classList.toggle("channel-info-hidden");
   showInfoChannelText.classList.toggle("show-channel-about");
}

showInfoChannelText.addEventListener("click", showHideAboutChannel);
