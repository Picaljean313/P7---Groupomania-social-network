SUBJECT :

- create a social network for a company of a dozen people


FUNCTIONAL SPECIFICATIONS REQUESTED :

Login :
- make a login page to connect or create an account
- be able to disconnect, and keep your session active until you do
- secure connection data

Home page : 
- create a list of posts from most recent to oldest

Post creation :
- be able to create posts with text and image
- be able to modify and delete your own posts

Likes :
- be able to like a post

Admin account : 
- create an admin status that allows you to modify or delete all posts in the network

Visual identity :
- use given font and color data
- make a responsive site


TOOLS USED :

- front : React (framework)
- back : Node.js (runtime) and Express.js (framework)
- database : MongoDB (database) and Mongoose (Object Data Modeling)
- documentation : OpenAPI specification


PERSONAL IMPROVEMENTS : 

- creation of an API documentation with OpenAPI specification

Features for standard users :
- add of pseudos, avatars and themes for users 
- users can track their activities on the network 
- users can modify their profile data (except for creation date, activity, and account status for standard users)
- users can also comment posts and react to comments 
- diversification of possible reactions on posts and comments 
- users can report a post or a comment, and cancel it
- users can modify and delete their own comments and reactions
- users can refresh home page without reloading the page 
- every user has his own profile page and has access to other users one 

Features for admins :
- admins can create new users and choose their status
- admins have access to monitoring interfaces of all profiles, all posts, all comments and all reports of the social network
- admins have direct access to the relevant user profiles and related posts on these interfaces



INSTALL GROUPOMANIA SOCIAL NETWORK :

- Node JS is necessary : download it on https://nodejs.org/en/download
    (this project runs on version v16.15.1)

- Groupomania Social Network uses MongoDB database. 
    Sign in on https://www.mongodb.com/atlas/database and create one cluster.

- replace <process.env.DB_CONNECT> variable in backend/app.js with your identification (example : <'mongodb+srv://<YOUR_NAME>:<YOUR_PASSWORD>@cluster0.ydibcla.mongodb.net/?retryWrites=true&w=majority'>)

- clone code of the app : https://github.com/Picaljean313/P7---Groupomania-social-network
  (code -> downlaod zip)

- install front and back dependencies : do 'npm install' in appropriated repositories in terminal for both front and back

- do 'nodemon server' in terminal for back repository to start server
  (sever will start on port 3001)

- do 'npm start' in terminal for front repository to start react app
  (react app will start on port 3000)

- open 'http://localhost:3000/' in your browser if needed



