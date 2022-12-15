# PLAYONE VOLLEYBALL

A website where volleyball players can meet up to find plays, games, or matches. It's simple to organize them and make friends.

## Table of Contents

- [Pain Points](#pain-points)
- [Test Account](#test-account)
- [System Architecture](#system-architecture)
- [Database Table Schema](#database-schema)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Tech Details](#tech-details)
- [Demo with User Flow](#demo-with-user-flow)
  - [Facebook Login](#facebook-login)
  - [Browse and Filter Plays](#browse-and-filter-plays)
  - [Immediate Notification](#immediate-notification)
  - [Build Plays](#build-plays)
  - [Update and Close Plays](#update-and-close-plays)
  - [Mailing Service for Signup](#mailing-service-for-signup)
  - [Leave Messages and Comments](#leave-messages-and-comments)
  - [Dashoard](#dashboard)
  - [Follow and Unfollow](#follow-and-unfollow)

## Pain Points

1. Willing to play volleyball, but having trouble finding teammates?
2. Where can I play volleyball and when?
3. Is the play free or not?
4. Is the court indoor or outdoor?
5. What is the group's skill level if I discover a play?
6. How can I join a group? Does anyone know that I registered?

## Test account

- Get Started on [PLAYONE VOLLEYBALL](https://playone-volleyball.online/)
- Explore your volleyball journey by using the accounts listed below.

  - Account_01 (Timmy)
    ```
    email: timmy@gmail.com
    password: Timmy123!
    ```
  - Account_02 (Jenny)
    ```
    email: jenny@gmail.com
    password: Jenny123!
    ```

- Please make sure the password is secure when creating a new account.
  - Rules of the password: a minimum of 8 letters, 1 of which must be uppercase, 1 lowercase, and 1 special symbol)
- To receive email notifications, try registering with your email.

## System Architecture

- Develop the project in Node.js with Express and deployed the applications to EC2.
- Send immediate notification to all online clients with server sent events.
- Use redis to fasten the loading of information.
- Make server stateless with AWS cloud service including RDS, ElastiCache, and CloudWatch.
- Integrate with a third-party API (mailgun) to provide mailing service.

<div align="center">
<img width="90%" alt="System Architecture" src="https://i.imgur.com/YeInPbF.png"/>
</div>

## Database Table Schema

<div align="center">
    <img width="90%" alt="database schema" src="https://i.imgur.com/gQlLx0H.png"/>
</div>

## Features

**Plays**

- Build | Signup | Close | Update plays.
- Browse plays on the home page.
- Filter plays with differents conditions.
- Leave messages.

**Immediate notification**

- Online users get notified when new plays are built.
- A button click can lead to the play's details page.

**Mailing Service**

- The user's fans are notified through email when building a play.
- When a player signup the play, the user is notified through email.
- When a user replies to the sign-up, the player is notified through email.

**Social Media**

- Update user page
- Follow / Unfollow other users
- Comment System and users' comment statistics
- Dashboard of history and incoming plays
- Sign-up and sign-in
- Quick lognin with Facebook

## Tech Stack

**Frontend:** jQuery | HTML | CSS

**Backend:** Node.js | Express | Nginx

**Database:** MySQL | Redis

**AWS Cloud service:** EC2 | RDS | CloudWatch | ElastiCache

**API Test:** jest | supertest

## Tech Details

**Rate Limiter**

- Rate limit is a mechanism used to limit the number of requests to an API end point.
- In this project, redis INCR and EXPIRE is used to operate rate limiting.
- To prevent race condition, MUlTI and EXEC were executed to make sure INCR and EXPIRE are performed.
- Limit: 500 requests per second.

**Server Sent Event**

- Server sent events(SSE) is a pushing technology that enables pushing notification from server to client via HTTP connection.
- SSE is a one way connection, the clients cannot send events to the server.
- The SSE API is contained in Event Source object.
- In this project, the server send notification to all online users when any user build a group play.

## Demo with User Flow

### Facebook Login

- Quick login with Facebook.
  <img alt="Facebook Login" src="https://i.imgur.com/ctQQiAW.gif"></img>

### Browse and Filter Plays

- Browse the plays, switch pages, and filter the plays.
  <img alt="Browse and Filter Plays" src="https://i.imgur.com/noVinbQ.gif"></img>

### Immediate Notification

- Online players get immediate notifications when a new group is built.
- Left: user_01; Right: user_02
- <img src="https://i.imgur.com/t5sInET.gif"></img>

### Build Plays

- Build a play easy and fast.
  <img alt="Build Plays" src="https://i.imgur.com/41hH2C8.gif"></img>

### Update and Close Plays

- Users can update and close their own play.
  <img alt="Update and Close Plays" src="https://i.imgur.com/08A7iOh.gif"></img>

### Mailing Service for Signup

- When the player signup games, an email will be sent to the user simultaneously.
  <img src="https://i.imgur.com/JDENRU1.gif"></img>

### Leave Messages and Comments

- User can leave messages and comments on each group.
  <img src="https://i.imgur.com/lvylkgG.gif"></img>

### Dashboard

- Browse history and incoming plays.
  <img src="https://i.imgur.com/tEYxG6o.gif"></img>

### Follow and Unfollow

- User can follow and unfollow each other.
  <img src="https://i.imgur.com/Leg9Hcn.gif"></img>
