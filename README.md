# Factored Frontend assessment

This is the frontend assessment for the Factored hiring process.

It consumes the API created in the backend assessment, for the entities User, Film, Planet, and Person. It comes with a small video game in which you click to shoot and try to avoid/destroy meteors on the main page.

furthermore, this visualization comes with the Details view, which can navigate to others example Luke Skywalker detail => Tatooine detail
The 3 general views can be accessed from the main page, and can also be filtered by every field. These tables are paginated, both in front and backend. which means no unnecessary API calls.
The sign-in and login function with a mock auth token. which enables interactions with the rest of the web app

It also includes 404 error page, and greetings to non-authed users, redirecting them to the login/sign-in pages.

# running the proyect
### `npm install`
### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

# Future improvements

- Theme consistency
- Password retrieval
- User expansion, profile picture, username, high score etc
- sorting functions
- secure-auth handling
