# blog-posts-api
express js rest api for blog posts

# Available End Points.
## /auth/signup
### Method: Put
### Headers:
Content-Type: application/json
### Body:
{
    "email":"Your email",
    "password": "Your Password",
    "name": "Your full name"
}
## /auth/login
### Method: Post
### Headers:
Content-Type: application/json
Authorization: Bearer "Your token"
### Body:
{
    "email": "Your email",
    "password":"Your Password"
}
return the Authorization Token on successful login

## /feed/posts
### Method: Get
### Headers:
Content-Type: application/json
Authorization: Bearer "Your token"
return the user posts.

## /feed/post
### Method: Post
### Headers:
Content-Type: application/json
Authorization: Bearer "Your token"
form-data: {
    title: post title,
    content: post content
    image: post image
}
create a new post

## /feed/post/postId
### Method: Get
### Headers:
Content-Type: application/json
Authorization: Bearer "Your token"

return the specified post details

## /feed/post/postId
### Method: Put
### Headers:
Content-Type: application/json
Authorization: Bearer "Your token"
form-data: {
    title: post title,
    content: post content
    image: post image
}
Update the specified post details

## /feed/post/postId
### Method: Delete
### Headers:
Content-Type: application/json
Authorization: Bearer "Your token"

Delete the specified post
