# Inspirobot
Followed a tutorial to build a Discord Bot, and then added more help feedback and functionality! Will send random inspiration quotes, and give nice messages when someone types sad messages.

# Installation
npm install bot folder and database folder
Make your own mongo database
Get a Discord Bot API Token
set up env for mongo database, Discord Token, and fetch url
node local.js and server.js

# Database Schema
  {
    encouragement: String
  }
Simple, but important. There are some sample encouragements included in server.js

# Commands
  These are the current list of commands:
        $inspire
        $list
        $new
        $del
        $help 
     $inspire:
        Sends you a random quote from zenquotes.io.
     $list:
        Gives you a list of the messages currently in the database.
      $new:
        Adds a message into the database.
      $del:
        Deletes a message from the Nice Database based on position. Note that this takes a number, not a string.
     $help:
        Gives info in the Discord chat.
    
