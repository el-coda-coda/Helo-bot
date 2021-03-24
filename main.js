const Discord = require('discord.js')
const client = new Discord.Client()
const bot_token = "ODE4NTQ4ODExNDEyNDA2MzA0.YEZq_A.zWbfzt2cQau45N2ylTlO9f7ttOg"


var ServerObject = []
var ServerMembers = []
var oldServerMembers = []
var textChannel = []

console.log("Helo - bot is started")
console.log("---------------------")
console.log()
console.log()

function memberFinder(guild){
	var array = []
	for(var i = 0; i < ServerObject.length; i++){
		if(ServerObject[i]["guild_name"] === guild){
			array.push(ServerObject[i].id)
		}
	}
	return array
}

function generalChannelFinder(guild){
	for (var i = 0; textChannel.length > i; i++){	
		if(textChannel[i]["guild_name"] === guild){
			if(textChannel[i]["channel_name"] === "chat") return textChannel[i]["id"]
		}
	}
	for (var e = 0; textChannel.length > e; e++){	
		if(textChannel[e]["guild_name"] === guild){
			if(textChannel[e]["channel_name"] === "general") return textChannel[e]["id"]
		}
	}
	return	textChannel[0]["id"]
}

client.once("ready", () => {
	client.user.setActivity("bambini in cantina (con il loro consenso)", {type : "WATCHING"})
	client.guilds.cache.forEach((guild) => {
		oldServerMembers[guild.name] = { id: guild.id, members : []}
		guild.channels.cache.forEach((channel) => {
			if (channel.type === "text"){
				let array = {
					"guild_name": guild.name, 
					"channel_name": channel.name, 
					"id" : channel.id 
				}
				textChannel.push(array) 
			}
		})
	})
})

client.on("voiceStateUpdate", (oldState, newState) => {
	ServerObject = []
	client.guilds.cache.forEach((guild) => {
		guild.channels.cache.forEach((channel) => {
			if(channel.type === "voice"){
				var VoiceChannel = client.channels.cache.get(channel.id)
				VoiceChannel.members.each((member) => {
					let memberInfo = {
							"name" : member.user.username,
							"id" : member.user.id,
							"guild_name" : guild.name,
							"guild_id" : guild.id,
							"channel_name" : channel.name,
							"channe_id" : channel.id
						}
					console.log("getting info from " + memberInfo.name)
					ServerObject.push(memberInfo)
				})
			}
		})
		ServerMembers[guild.name] = { id: guild.id, members : memberFinder(guild.name)}
	})
	console.log("All members: ")
	console.log(ServerObject)
	console.log("")

	client.guilds.cache.forEach((guild) => {
		console.log(generalChannelFinder(String(guild.name)))
		let txtChannel = client.channels.cache.get(generalChannelFinder(String(guild.name)))

		console.log("")
		console.log("----Persone in " + guild.name + "------")
		console.log("")
		console.log("---Server member---")
		console.log(ServerMembers[guild.name])
		console.log("---Old server members---")
		console.log(oldServerMembers[guild.name])
		
		if(oldServerMembers[guild.name]["members"].length === ServerMembers[guild.name]["members"].length){
			console.log("NESSUNO DI NUOVO IN " + guild.name)
			console.log("")
			oldServerMembers[guild.name]["members"] = ServerMembers[guild.name]["members"]
			console.log("Member diff: ")
			let diff = ServerMembers[guild.name]["members"].filter(x => !oldServerMembers[guild.name]["members"].includes(x))
			console.log(diff)
		}
		else{
			if(oldServerMembers[guild.name]["members"].length < ServerMembers[guild.name]["members"].length){
				console.log("ENTRATA IN " + guild.name)
				console.log("")
				console.log("OLD LENGTH: " + oldServerMembers[guild.name]["members"].length)
				console.log("NEW LENGTH: " + ServerMembers[guild.name]["members"].length)
				
				let diff = ServerMembers[guild.name]["members"].filter(x => !oldServerMembers[guild.name]["members"].includes(x))
				console.log("Member diff: ")
				console.log(diff)
				console.log()

				oldServerMembers[guild.name]["members"] = ServerMembers[guild.name]["members"]
				txtChannel.send("Helo! " + "<@" + String(diff) + ">").then(msg => msg.delete({timeout: 15000}))
			}
			else{
				console.log("E' uscito qualcuno da " + guild.name)
				console.log("")
				console.log("OLD LENGTH: " + oldServerMembers[guild.name]["members"].length)
				console.log("NEW LENGTH: " + ServerMembers[guild.name]["members"].length)
				
				let diff = oldServerMembers[guild.name]["members"].filter(k => !ServerMembers[guild.name]["members"].includes(k))
				console.log("Member diff: ")
				console.log(diff)

				txtChannel.send("Adios! " + "<@" + String(diff) + ">").then(msg => msg.delete({timeout: 15000}))
				oldServerMembers[guild.name]["members"] = ServerMembers[guild.name]["members"]
			}
		}
	})
})
client.login(process.env.bot_token)