/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

function viewFollow(fields) {
  fetch(`/api/follows/${fields.followerId}/${fields.followedId}`)
    .then(showResponse)
    .catch(showResponse);
}

function viewAllFollowedFreets(fields) {
  fetch('/api/follows/freets', {method: 'GET'})
    .then(showResponse)
    .catch(showResponse);
}

function createFollow(fields) {
  fetch(`/api/follows/${fields.followedId}`, {method: 'POST'})
    .then(showResponse)
    .catch(showResponse);
}

function deleteFollow(fields) {
  fetch(`/api/follows/${fields.followerId}/${fields.followedId}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}
