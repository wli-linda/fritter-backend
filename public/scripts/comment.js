/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

function viewCommentsByPost(fields) {
  fetch(`/api/comments/${fields.post}`)
    .then(showResponse)
    .catch(showResponse);
}

function createComment(fields) {
  fetch(`/api/comments/${fields.post}`, {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function deleteComment(fields) {
  fetch(`/api/comments/${fields.id}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}
