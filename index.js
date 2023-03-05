const express=require("express")
const app=express()
const http = require("http")
const server= http.createServer(app)
const {Server}=require("socket.io")
const io=new Server(server)

const fs=require("fs")

const {Base64Binary} = require(utils.js)
const config=require("config.json")
const crypto = require('crypto');

const sequelize = require('sequelize');
const seq = new sequelize('production', config.db_username, config.db_password, {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'production.sqlite',
})


console.log("[LOG] Generating keys for DH with blowfish encryption.")
const blowfish=require("blowfish")
const keyGen=createDiffieHellman(2048)
const keyGenVars={prime:keyGen.getPrime("base64"), generator:keyGen.getGenerator("base64"), publicKey:keyGen.generateKeys("base64")}
console.log("[LOG] Generated keys.")

//loading in all the models for the tables for the database
console.log("[LOG] Loading models for table setup for SQLite using Sequelize.")
const models={} 
for(let file of fs.readdirSync('./models').filter(file => file.endsWith('.js'))){
	models[file.replace(".js", "")]=require("./models/"+file)(seq, sequelize.DataTypes)
}
console.log("[LOG] Loaded models.")


var sessionStorage={}

//loading in all the post requests from seperate files
console.log("[LOG] Creating all POST request listeners.")
postListeners = {} 
for (const file of fs.readdirSync("./postRequests").filter(file => file.endsWith('.js'))) {
	const postRequest = require("./postRequests/"+file);
	if ('data' in postRequest && 'execute' in postRequest) {
		postListeners[postRequest.data.name]=postRequest;
	} else {
		console.log(`[WARNING] The postListener at ${file} is missing a required "data" or "execute" property.`);
	}
}
io.on("connection", ()=>{
	Object.values(postListeners).forEach(async (postListener)=>{
		socket.on(postListener.data.name, (data)=>{
			try{
				postListener.execute(data, socket, io, models, keyGen)
			}catch(e){
				console.error("[ERROR] ["+postListener.data.name+"] ", e)
			}
		})
	})
})


console.log("[LOG] Created all listeners.")


server.listen(42069, ()=>{console.log(new Date().toUTCString()+"> "+"Server started.")})

*/