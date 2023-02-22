## Challenge Me

This repository is created for team Ice Hot Pot during lecture CSCC09 in 2022S UTSC.

## Team Member

- Xuen Shen
- Hongxiao Niu

## Short Intro Vedio

- https://youtu.be/BLR2WaBQ_K4

## The Deploy link

- https://challengeme.me/

## Description of the web application:

1. A [Kahoot](https://kahoot.com/)-like application that has an extensive list of predefined question sets and allows multiple people to answer the question set synchronously in one session. People will be able to voice chat with one another synchronously at the same time as they are answering questions.
2. The app will calculate each person’s score based on the correctness, and speed of the answer to each question, and ranks the competitors at the end of the question.
3. Users can sign in using google and synchronize with the google account’s profile photo. Or a user can register their own account.
4. A user can see a list of different topics, and he/she can then choose one of the quizzes under a certain topic to start the quiz; the app will generate a session code which can be used for other people to join the quiz.
5. Other players can click a “join quiz” icon on the page to join the quiz room other people provided.
6. The app keeps track of each logged-in user’s recent overall performance in the quizzes/ recently used.

## Challenge Factor

1. Real-time interactions:

- This is what we will be using to implement the questions page, which allows people answer questions at the same time.

2. Peer-to-Peer Webrtc (Max four people)
3. Matchmaking system allow people to join a public playroom and play with others.

## Features in Beta version

1. Allow users to create rooms and invite friends
2. Users can answer questions simultaneously in the same room
3. The user system allows users to create an account, login/logout, and level

## Additional features in the final version

1. The voice chat system allows users voice communication when answering questions
2. Matchmaking system, users can start matching by either creating a room or quickplay

## Describe the tech stack that would be used to build the application

- Frontend: [React.js](https://reactjs.org/)
- Backend: [Node.js](https://nodejs.org/en/), [Express.js](https://expressjs.com/)
- Database: [Postgres](https://www.postgresql.org/)
- Reverse Proxy
- Docker

## Describe the method of deployment

1. Domain names will register with [Github Student Developer Pack](https://education.github.com/pack)
2. [Amazon Lightsail](https://aws.amazon.com/lightsail/) for hosting platform(VM)
3. [Let's Encrypt](https://letsencrypt.org/) for TLS Certificates
