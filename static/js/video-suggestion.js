const buttonComment = document.querySelector(".button-comment");
const buttonSuggestion = document.querySelector(".button-suggestion");
const videoSuggestionContainer = document.querySelector(
   ".video-suggestion-container"
);
const videoCommentContainer = document.querySelector(
   ".video-comment-container"
);

buttonComment.addEventListener("click", () => {
   videoCommentContainer.style.display = "block";
   videoSuggestionContainer.style.display = "none";

   buttonComment.style.background = "var(--primary-color)";

   buttonSuggestion.style.background = "transparent";
});

buttonSuggestion.addEventListener("click", () => {
   videoCommentContainer.style.display = "none";
   videoSuggestionContainer.style.display = "block";

   buttonSuggestion.style.background = "var(--primary-color)";

   buttonComment.style.background = "transparent";

   loadedData();
});
