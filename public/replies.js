document.addEventListener("DOMContentLoaded", function() {
  // reply toggle form från knapp
  document.querySelectorAll(".reply-button").forEach(button => {
    button.addEventListener("click", function(event) {
      event.preventDefault();
      const tweetId = this.dataset.tweetId;
      const form = document.querySelector(`#reply-form-${tweetId}`) || document.querySelector(`.reply-form[data-tweet-id="${tweetId}"]`);
      if (form.style.display === "none") {
        form.style.display = "block";
      } else {
        form.style.display = "none";
      }
    });
  });

  // replies varje tweet tweet
  document.querySelectorAll(".ReplyDiv").forEach(div => {
    const tweetId = div.id.replace("replydiv-", "");
    fetch(`/replies/${tweetId}`)
      .then(response => response.json())
      .then(replies => {
        const repliesList = div.querySelector(".replies-list");
        repliesList.innerHTML = "";
        replies.forEach(reply => {
          const replyElement = document.createElement("div");
          replyElement.classList.add("reply");
          replyElement.innerHTML = `<strong>${reply.username}</strong>: ${reply.message}`;
          repliesList.appendChild(replyElement);
        });
      });
  });

  // hantera reply från skapande
  document.querySelectorAll(".reply-form").forEach(form => {
    form.addEventListener("submit", function(event) {
      event.preventDefault();
      const tweetId = this.dataset.tweetId;
      const message = this.querySelector("textarea[name='message']").value;
      fetch("/replies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ tweet_id: tweetId, message: message })
      }).then(response => {
        if (response.ok) {
          // ladda om 
          fetch(`/replies/${tweetId}`)
            .then(response => response.json())
            .then(replies => {
              const repliesList = document.querySelector(`#replydiv-${tweetId} .replies-list`);
              repliesList.innerHTML = "";
              replies.forEach(reply => {
                const replyElement = document.createElement("div");
                replyElement.classList.add("reply");
                replyElement.innerHTML = `<strong>${reply.username}</strong>: ${reply.message}`;
                repliesList.appendChild(replyElement);
              });
              // rensa och clera box
              form.querySelector("textarea[name='message']").value = "";
              form.style.display = "none";
            });
        } else {
          alert("Failed to post reply");
        }
      });
    });
  });
});
