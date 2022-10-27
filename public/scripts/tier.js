/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

function viewFollowerTier(fields) {
  fetch(`/api/tiers/${fields.followerId}/${fields.followedId}`)
    .then(showResponse)
    .catch(showResponse);
}

// function viewTierStatusByOwner(fields) {
//   console.log("viewTierStatusByOwner");
//   console.log("followId", fields.followedId);
//   fetch(`/api/tiers/${fields.followedId}`)
//     .then(showResponse)
//     .catch(showResponse);
// }

function updateTierSystemStatus(fields) {
  console.log(1);
  fetch(`/api/tiers/status`, {method: 'PUT'})
    .then(showResponse)
    .catch(showResponse);
}

function updateOverrideFollowers(fields) {
  fetch(`/api/tiers/${fields.followerId}/${fields.followedId}?operation=${fields.operation}`, 
  {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}