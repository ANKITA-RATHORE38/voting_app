# Voting Application

This is a backend application for a voting system where users can vote for candidates. It provides user authentication, candidate management, voting, and profile management. This project was developed by following a tutorial/reference and includes my own changes and modifications for learning purposes.

## Features

* User signup and login with Aadhar Card Number and password
* Users can view the list of candidates
* Users can vote for a candidate only once
* Admin can add, update, and delete candidates
* Admin cannot vote
* Users can view their profile and change their password
* JWT-based authentication

## Technologies Used

* Node.js
* Express.js
* MongoDB
* JWT for authentication

## Installation

1. Clone the repository:

```bash
git clone <https://github.com/ANKITA-RATHORE38/voting_app.git>
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file and add your environment variables.

4. Start the application:

```bash
npm start
```

## API Endpoints

### Authentication

* `POST /signup` — Sign up a user
* `POST /login` — Login a user

### Candidates

* `GET /candidates` — Get candidates
* `POST /candidates` — Add candidate (Admin only)
* `PUT /candidates/:id` — Update candidate (Admin only)
* `DELETE /candidates/:id` — Delete candidate (Admin only)

### Voting

* `GET /candidates/vote/count` — Get vote count
* `POST /candidates/vote/:id` — Vote for a candidate (User only)

### User Profile

* `GET /users/profile` — Get user profile
* `PUT /users/profile/password` — Change password


