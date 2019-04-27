# HIKING REPORT

# SETUP DATABASE
-IN POSTGRES
  -create role 'your user' with password 'your password';
  -create database 'your database name' with owner 'your user';
  -alter role 'your user' with login;
# SETUP CONFIG
-CREATE CONFIG FOLDER IN ROOT DIRECTORY
  -mkdir config
  -cd config
  -touch config.js

-CONFIG FILE SHOULD LOOK SOMETHING LIKE

  module.exports = {
  database: {
    user: 'user',
    password: 'password',
    database: 'database name'
  },
  weather: {
    apiKey: 'your api key',
    apiKey2: 'your api key'
  },
  map: {
    key: 'your api key'
  }
}


#MY STUFF TO DO
-run knex
-figure out all api keys
-run the functions at the bottom of server.js to get data once you have everything up for db
-button on top right is not working
- weather underground api is dead 
  - have to go and find new weather api and rewrite function to get weather data 
  - confirm connecting trails by having weather id already associated to it. 
  - confirm you can find weather for each lat / long of trails
