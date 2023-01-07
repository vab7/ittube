let commentList = document.querySelectorAll(".comment");

let inputComment = document.getElementById("add-comment");
let inputCommentReview = document.getElementById("comment-review");

const reviews = document.querySelectorAll(".reviews");
const commentReviewContainer = document.querySelectorAll(
   ".comment-review-container"
);
// let commentsContainer = document.querySelector(".comments-container");
const commentCloseIcon = document.querySelector(".comment-close-icon");
const commentLikesCount = document.querySelectorAll(".comment-likes-count");
const filterCommentContainer = document.querySelector(
   ".filter-comment-container"
);

const filterCommentValue = document.querySelector(".filter-comment-value");

filterCommentContainer.addEventListener("click", () => {
   if (filterCommentContainer.classList.contains("filter-popular")) {
      filterCommentValue.innerHTML = "Новые";
   } else {
      filterCommentValue.innerHTML = "Популярные";
   }

   filterCommentContainer.classList.toggle("filter-popular");
});

function addReview(name, id) {
   inputComment.value = `${name}, `;
   inputCommentReview.value = id;
}

for (let i = 0; i < reviews.length; i++) {
   reviews[i].addEventListener("click", () => {
      commentReviewContainer[i].classList.toggle("review-hidden");
   });
}

commentCloseIcon.addEventListener("click", () => {
   inputComment.value = "";
});

function addComment(csrf_token, video_pk, user_pk, user) {
   var _text = $("#add-comment").val();
   var _parent = $("#comment-review").val();

   var response = grecaptcha.getResponse();

   // ajax
   $.ajax({
      url: "/comment/",
      type: "post",
      data: {
         text: _text,
         parent: _parent,
         video_pk: video_pk,
         user_pk: user_pk,
         csrfmiddlewaretoken: csrf_token,
         captcha: response.length != 0,
         "g-recaptcha-response": response,
      },
      dataType: "json",
      beforeSend: function () {
         $(".button-send-comment").value = "saving...";
      },
      success: function (response) {
         if (response.status == 200) {
            $("#add-comment").val("");

            comments_array = $(".all-comments-text").text().split(" ");

            $(".all-comments-text").text(
               `${comments_array[0]} ${++comments_array[1]}`
            );

            var _comment =
               '\
               <li class="comment">\
                  <div class="user-comment-container">\
                     <div class="comment-user-icon">\
                        <svg\
                              width="40"\
                              height="40"\
                              viewBox="0 0 40 40"\
                              fill="none"\
                              xmlns="http://www.w3.org/2000/svg"\
                              >\
                              <path\
                                 fill-rule="evenodd"\
                                 clip-rule="evenodd"\
                                 d="M20 40C31.046 40 40 31.046 40 20C40 8.954 31.046 0 20 0C8.954 0 0 8.954 0 20C0 31.046 8.954 40 20 40ZM26 16C26 17.5913 25.3679 19.1174 24.2426 20.2426C23.1174 21.3679 21.5913 22 20 22C18.4087 22 16.8826 21.3679 15.7574 20.2426C14.6321 19.1174 14 17.5913 14 16C14 14.4087 14.6321 12.8826 15.7574 11.7574C16.8826 10.6321 18.4087 10 20 10C21.5913 10 23.1174 10.6321 24.2426 11.7574C25.3679 12.8826 26 14.4087 26 16ZM8 30C9.39602 28.1358 11.2075 26.6228 13.2906 25.5813C15.3737 24.5397 17.671 23.9983 20 24C22.329 23.9983 24.6263 24.5397 26.7094 25.5813C28.7925 26.6228 30.604 28.1358 32 30C30.604 31.8642 28.7925 33.3772 26.7094 34.4187C24.6263 35.4603 22.329 36.0017 20 36C17.671 36.0017 15.3737 35.4603 13.2906 34.4187C11.2075 33.3772 9.39602 31.8642 8 30Z"\
                                 fill="white"\
                                 fill-opacity="0.5"\
                              />\
                        </svg>\
                     </div>\
                     <div class="comment-container">\
                        <div class="comment-top-container">\
                           <span class="comment-username"\
                              >' +
               user +
               '</span>\
                        </div>\
                        <div class="comment-text-container">\
                           ' +
               _text +
               '\
                        </div>\
                        <div class="comment-bottom-container">\
                           <span> только что</span>\
                        </div>\
                     </div>\
                  </div>\
               </li>\
               ';

            $(".comments-users-ul").prepend(_comment);
         }
      },
   });

   return false;
}

// function addCommentLike(csrf_token, comment_id, user_pk) {
//    $.ajax({
//       url: "/comment/like/",
//       type: "post",
//       data: {
//          comment_id: comment_id,
//          user_id: user_pk,
//          csrfmiddlewaretoken: csrf_token,
//       },
//       dataType: "json",
//       success: function (response) {
//          console.log(response.status);
//       },
//    });

//    return false;
// }

// function commentLikeClick(i) {
//    if (commentLikeContainer[i].classList.contains("like-active")) {
//       commentLikesCount[i].innerHTML -= 1;

//       if (commentLikesCount[i].innerHTML == 0) {
//          commentLikesCount[i].innerHTML = "";
//       }
//    } else {
//       commentLikesCount[i].innerHTML =
//          Number(commentLikesCount[i].innerHTML) + 1;
//    }

//    commentLikeContainer[i].classList.toggle("like-active");
// }

// for (let i = 0; i < commentList.length; i++) {
//    commentLikeContainer[i].addEventListener("click", () => commentLikeClick(i));
// }

// function filterComment(csrf_token) {
//    boolFilter = filterCommentContainer.classList.contains("filter-popular");

//    $.ajax({
//       url: "/comment/filter/",
//       type: "post",
//       data: {
//          boolFilter: boolFilter,
//          csrfmiddlewaretoken: csrf_token,
//       },
//       dataType: "json",
//       success: function (response) {
//          if (response.status == 200) {
//             commentsContainer.remove();
//             commentsContainer = document.createElement("comments-container");

//             commentsContainer.innerHTML = '\

//             ';

//             document
//                .querySelector(".publish-comment-container")
//                .after(commentsContainer);
//          }
//       },
//    });
// }
