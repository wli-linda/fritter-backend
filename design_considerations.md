# rough design considerations doc
- getting rid of feed concept? not enough OP itself, can be subsumed as a part of follow concept or filter concept
    - under follow concept --> GET request to fetch all posts from followed users
- get rid of temporary states outlined in A4 in the data model representations
    - can retrieve with cache or regenerate rather than use database to store?
- filter (feed) rely on implementation of follow, tiered follower rely on implementation of comment
    - comment can contain middleware validation to incorporate tiered follower concept
- better naming for schema of tiered followers system? or full name is fine?
- virtuals vs. modularity

## other questions
- why ```authorId: Types.ObjectId | string``` in freet collections `addOne`?
- `.reduce()` in async giving me heavy pain...

## other implementation notes
- to populate multiple fields, pipe `.populate('field1').populate('field2')`, not `.populate('field1', 'field2')`
- vscode auto import folder structure is wrong, need to manually update
- missing the `next()` in middleware is dangerous....
- greedy matching of express routes, put more specific routes first in the file
- concern re: if a user is deleted, it's maybe not very optimized to delete their status in someone else's tiered followers system? not sure what the time complexity of deletion of a particular element in JS arrays is 
- whether to take as input ownerId or tierId??

## structure of code
- model (mongoDB schema)
- collection (CRUD functions with database)
- middleware (input validation rules) & util (construct response)
- router (api req -> middleware -> res)
- add router to `/api/index.ts`
- public (frontend)
    - scripts
        - concept specific .js (fields.XXX should match input ids in index.html)
        - add form handlers to index.js 
    - add `<script scr="XXX.js"></script>` on top & add relevant form fields to index.html 