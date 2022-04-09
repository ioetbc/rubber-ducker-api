# rubber-ducker-2 API README

## Run the extension locally

1. run `npm run watch` this will compile the api typescript code into a folder called dist using webpack

2. run `npm run dev` to start the server

## Database setup

To ssh into the db thats hosted on postgres run this command (find the values in heroku > rubber-ducker > settings > database credentials)
`psql --host= --port=5432 --username= --password --dbname=`

To run a migration ssh into the db using the above command then run
`psql \i api/src/migrations/reviews.sql`

## Authenitcation logic

1. using a package called `passport` along with `passport-github` to help with the authentication logic.

2. the first method is `passport.serializeUser` which takes the user object serializes it and attaches the user back onto the `req` object `req.session.passport.user`

3. access this url `http://localhost:3002/auth/github` the `passport.authenticate` method will prompt github to open an authentication window in the browser once you login a new startgy will be called and the third argument passed in is the profile of the user that just logged in. I am then checking the `profile.id` against the github_id column in the postgres db. If no row is returned then im updating the db with the new users data. Once the update is complete the `done` callback function is called and creates a jwt accesToken once authenticated you are directed to `/auth/github/callback` which gets the accessToken from the req and redirects the user to `http://localhost:54321/auth/${req.user.accessToken}`. When the user clicks on the login button in the extension UI I spin up a polka server which is listening on port `54321`. This file `extension/src/authenticate.ts` then takes the accessToken out of the paramas and saves it in the global state of the extension. This access token is then added to subsequent requests to the backend so that we know the request is coming from an authorized user.

4. the `/me` route gets the accessToken from the header which will be attached to the authorization headers from the UI since we have stored the access token in the global state. Once I have checked the auth header exists and there is a token I then decode the accessToken using `jwt.verify` method. In this file `api/src/utils/authenticateUser.ts` when I call `jwt.sign()` I pass in the userId = `user.github_id` this means that we can then use the `userId` thats returned to look up the user in the db and return the profile
