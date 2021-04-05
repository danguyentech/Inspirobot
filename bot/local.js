/* This code needs to be reformatted to pull from a new database. Can be used in Repl.it, but not here*/
const Discord = require("discord.js")
const fetch = require("node-fetch")
const dotenv=require('dotenv')

dotenv.config()
const client = new Discord.Client()

let sadWords = ["sad", "depressed", "unhappy", "angry", "miserable", ":FoxSad:"]

/* db.get("encouragements").then(encouragements => {
  if (!encouragements || encouragements.length < 1) {
    db.set("encouragements", starterEncouragements)
  }  
}) */

function getQuote() {
  return fetch("https://zenquotes.io/api/random")
    .then(res => {
      return res.json()
      })
    .then(data => {
      return data[0]["q"] + " -" + data[0]["a"]
    })
}

const updateEncouragements= async(encouragingMessage)=> {
    let response = await fetch(`${process.env.URL}`, {
        method: 'POST',
        body: JSON.stringify({
            encouragement: encouragingMessage
        }),
        headers:{
            "Content-type": "application/json"
        }
    })
    let encouragements = await response.json()
    return encouragements
}

const getEncouragements= async()=> {
  let response = await fetch(`${process.env.URL}`)
  let encouragements = await response.json()
  return encouragements
}

const deleteEncouragment=async(id)=> {
  let response = await fetch(`${process.env.URL}${id}`, {
    method: 'DELETE',
    headers:{
        "Content-type": "application/json"
    }
})
let encouragements = await response.json()
return encouragements
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on("message", msg => {
  if (msg.author.bot) return
    
  if (msg.content === "$inspire") {
    getQuote().then(quote => 
    msg.channel.send(quote))
  }

  if (sadWords.some(word => (msg.content.toLowerCase()).includes(word)) && !msg.content.includes(`$`) ) {
    let messageLowerCased=msg.content.toLowerCase()
    let properMessage=messageLowerCased.split(' ')
    if(sadWords.some(word => properMessage.includes(word))){
      getEncouragements().then(encouragements => {
        const encouragement = encouragements[Math.floor(Math.random() * encouragements.length)].encouragement
        msg.reply(encouragement)
        })
    }
  }

  if (msg.content.startsWith("$new")) {
    encouragingMessage = msg.content.split("$new ")[1]
    if(encouragingMessage==undefined){
      return msg.channel.send(`Try adding a nice message to be included in the Nice Database!`)
    }
    updateEncouragements(encouragingMessage)
    msg.channel.send(`This message has been added: "${encouragingMessage}"`)
  }

  if (msg.content.startsWith("$del")) {
    let index = parseInt(msg.content.split("$del ")[1])
    let properNumber=index-1
    if (isNaN(properNumber)){
      return msg.channel.send(`Sorry! This needs a number to delete a message. Try $del [number].`)
    } else{
        getEncouragements().then(encouragements => {
          if (encouragements.length > properNumber) {
            msg.channel.send(`The message: "${encouragements[properNumber].encouragement}" has been deleted.`)
            deleteEncouragment(encouragements[properNumber]._id)
        } else{
            msg.channel.send("Sorry! The number you requested is larger than the database. Try $list to get a current amount.")
          }
      })
    }
  }

   if (msg.content.startsWith("$list")) {
    getEncouragements().then(encouragements => {
      let number=1
      let finalMessage=[]
      for (x=0; x<encouragements.length; x++){
        finalMessage.push(`${number}. ${encouragements[x].encouragement}`)
        number++
      }
      msg.channel.send(finalMessage)
    })
  }

  if (msg.content.startsWith('$help')){
    let targetHelp=msg.content.split(` `)
     switch (targetHelp[1]){
      case undefined:
       msg.channel.send(`There are the current list of commands:
        $inspire
        $list
        $new
        $del
        Type $help [command] to find out how it works.`);
        break;
      case `$inspire`:
        msg.channel.send(`$inspire:
        Sends you a random quote from zenquotes.io.`)
        break;
      case `$list`:
        msg.channel.send(`$list:
        Gives you a full list of the encouraging messages currently in the Nice Database.`)
        break;
      case `$new`:
        msg.channel.send(`$new [message]:
        Adds your nice message into the Nice Database.`)
        break;
      case `$del`:
        msg.channel.send(`$del [number]:
        Deletes a message from the Nice Database based on position.`)
        break;
      default:
        msg.channel.send(`Sorry! This is an unrecognised command. Try $help to get a list of commands, or remove the square brackets from your command.`)
    }
  }
})

client.login(process.env.TOKEN)