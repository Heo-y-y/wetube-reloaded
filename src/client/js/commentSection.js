/*const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");

let deleteComments = document.querySelectorAll("#delete__comment");

const addComment = (text, id) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.dataset.id = id;
  newComment.className = "video__comment";
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  span.innerText = ` ${text}`;
  const span2 = document.createElement("span");
  span2.innerText = "❌";
  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(span2);
  videoComments.prepend(newComment);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: { "Content-type": "application/json" }, // information about request
    body: JSON.stringify({ text }),
  });

  if (response.status === 201) {
    textarea.value = "";
    const json = await response.json(); // json 추출.
    addComment(text, json.newCommentId);
    deleteComments = document.getElementById("delete__comment");
    deleteComments.removeEventListener("click", handleDeleteComment);
    deleteComments.addEventListener("click", handleDeleteComment);
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}

const handleDeleteComment = async (event) => {
  const li = event.srcElement.parentNode;
  const {
    dataset: { id: commentId },
  } = li;

  await fetch(`/api/comments/${commentId}/delete`, {
    method: "DELETE",
  });
  li.remove();
};

if (deleteComments) {
  deleteComments.forEach((deleteComment) => {
    deleteComment.addEventListener("click", handleDeleteComment);
  });
}*/
const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const deleteCommentBtns = document.querySelectorAll(".deleteComment");

// 댓글 삭제 using ❌
const handleDeleteComment = async (event) => {
  const li = event.srcElement.parentNode;
  const {
    dataset: { id: commentId },
  } = li;
  li.remove();
  const response = await fetch(`/api/comments/${commentId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// frontend에서의 추가댓글창 출력(실시간)
const addComment = (text, id) => {
  const videoComments = document.querySelector(".video__comments ul"); // 동영상 댓글.
  const newComment = document.createElement("li");
  newComment.className = "video__comment";
  newComment.dataset.id = id; // (4) 새로운 댓글의 id. (새로 작성한 댓글을 삭제도 할 수 잇도록 )
  const icon = document.createElement("i");
  icon.className = "fas fa-comment"; // 아이콘
  const span = document.createElement("span");
  span.innerText = ` ${text}`; // 코멘트 내용
  const span2 = document.createElement("span");
  span2.className = "deleteBtn";
  span2.innerText = "❌"; // 삭제 버튼 추가
  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(span2); // newComment에 아이콘, 내용, 삭제버튼을 더해주고,
  videoComments.prepend(newComment); // li를 ul에 추가할 때, 댓글 리스트의 맨 위에 추가

  span2.addEventListener("click", handleDeleteComment); // ❌ 클릭하면, 코멘트 삭제
};

// 댓글 작성
const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value; // 사용자가 내용을 적고,
  const videoId = videoContainer.dataset.id; // 어떤 비디오에 댓글을 달지 알아야 해서.
  // text가 비어있으면 request를 보내지 않도록.
  if (text === "") {
    return;
  }
  // fetch는 JS를 통해서 request를 보낼 수 있게 만들어준다. URL 변경 없이!
  // fetch는 DB랑 연동되는 시간이 있어서 await해줘야 한다!
  // (2) frontend에서는 response이 오길 기다린 다음에, (feat.await)
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // (1) backend에게 string을 보내고 있는 것 같지만, 사실 Json string을 보내고 있는 거야!
    },
    body: JSON.stringify({ text }), // (1) Javascript object를 받아서, Json string으로 바꿔서 보낼 수 있도록 하고,
  });
  // response를 json형식으로 얻어야 해서.
  // (0) 201을 받았을 때만 발생하는 조건이다.
  if (response.status === 201) {
    textarea.value = ""; // 댓글창을 비우게 됨.
    const { newCommentId } = await response.json(); //(3) response 안에서 json으로 메세지를 추출해서, 새로운 댓글의 id를 response 안에서 받을 수 있는 것이다.
    addComment(text, newCommentId); // backend가 text와 id를 보내주면, frontend에서 text와 새로작성한 댓글을 추출하려고,
  }
};

form.addEventListener("submit", handleSubmit);
deleteCommentBtns.forEach((deleteCommentBtn) =>
  deleteCommentBtn.addEventListener("click", handleDeleteComment)
);
