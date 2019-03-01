//
// Delete a comment
//
$(document).on("click", ".delete-comment", function() {
  // Get the id of the comment
  const commentId = $(this).attr("comment-id");
  
  // Now make an ajax call for the comment
  $.ajax({
    method: "DELETE",
    url: "/comment/" + commentId
  })
    .then(function(data) {
      console.log(data);
      window.location.reload();
    });
});

//
// Delete an article
//
$(document).on("click", ".delete-article", function() {
  // Get the id of the article
  const articleId = $(this).attr("article-id");
  
  // Now make an ajax call for the comment
  $.ajax({
    method: "DELETE",
    url: "/api/articles/" + articleId
  })
    .then(function(data) {
      console.log(data);
      window.location.reload();
    });
});