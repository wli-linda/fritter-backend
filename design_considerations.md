# rough design considerations doc
- getting rid of feed concept? not enough OP itself, can be subsumed as a part of follow concept or filter concept
    - under follow concept --> GET request to fetch all posts from followed users
- get rid of temporary states outlined in A4 in the data model representations
    - can retrieve with cache or regenerate rather than use database to store?
- filter (feed) rely on implementation of follow, tiered follower rely on implementation of comment
    - comment can contain middleware validation to incorporate tiered follower concept
- better naming for schema of tiered followers system? or full name is fine?