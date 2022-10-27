/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

function createCategory(fields) {
  fetch(`/api/categories`, 
  {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function viewCategoriesByAuthor(fields) {
  fetch(`/api/categories/${fields.author}`)
    .then(showResponse)
    .catch(showResponse);
}

function deleteCategory(fields) {
  fetch(`/api/categories/${fields.categoryId}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}

function updateCategory(fields) {
  fetch(`/api/categories/${fields.categoryId}/${fields.itemId}?operation=${fields.operation}`, {method: 'PUT'})
  .then(showResponse)
  .catch(showResponse);
}