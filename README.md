## Music Recommendation API Setup Guide

This is a backend recommendation system for a social music player system. The system returns music recommendations based on what music a user has heard before and the music his followees have heard.

Please install all node modules with this command:
> npm install


We will need to configure MongoDB in order for our application to contain both source code and data.
Use the following commands to configure MongoDB by pointing the database path to a newly constucted folder called ./data:
> mkdir ./data
>
> mongod --dbpath ./data

Preload the database with a small sample of musics
> npm run load

Run the server on another terminal by using this command:
> npm start

Use the following command to run tests:
> npm test

Use the following command to get recommendations for user 'a'
> npm run recommendations
