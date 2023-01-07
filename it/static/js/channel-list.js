const filterChannelContainer = document.querySelector(
   ".filter-channel-container"
);
const filterChannelValue = document.querySelector(".filter-channel-value");

const buttonAddChannels = document.querySelectorAll(".button-add-channels");
const channelsButtonAddChannel = document.querySelectorAll(
   ".channels-button-add-channel"
);
const channelsSubscribersCount = document.querySelectorAll(
   ".channels-subscribers-count"
);
const doneIcon1 = document.querySelectorAll(".done-icon");
const add_boxIcon1 = document.querySelectorAll(".add_box-icon");

if (filterChannelContainer != null) {
   filterChannelContainer.addEventListener("click", () => {
      if (filterChannelContainer.classList.contains("filter-popular")) {
         filterChannelValue.innerHTML = "Новые";
      } else {
         filterChannelValue.innerHTML = "Популярные";
      }

      filterChannelContainer.classList.toggle("filter-popular");
   });
}

for (let i = 0; i < buttonAddChannels.length; i++) {
   buttonAddChannels[i].addEventListener("click", () => {
      if (doneIcon1[i].classList.contains("icon-active")) {
         userSubscribesValueChannel.innerHTML -= 1;
      } else {
         userSubscribesValueChannel.innerHTML =
            Number(userSubscribesValueChannel.innerHTML) + 1;
      }

      doneIcon1[i].classList.toggle("icon-active");
      add_boxIcon1[i].classList.toggle("icon-active");
   });
}
