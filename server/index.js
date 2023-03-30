const express=require("express")
const app=express()
const http = require("http")
const server= http.createServer(app)
const {Server}=require("socket.io")
const io=new Server(server)

const mailer=require("nodemailer")

const fs=require("fs")
const utils = require("./utils.js")
const config=require("./config.json")


const crypto = require('crypto');

const sequelize = require('sequelize');
const seq = new sequelize('production', config.database.username, config.database.password, {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: config.database.filename,
})

/*
console.log("[LOG] Generating keys for DH exchange with AES encryption.")
//const blowfish=require("blowfish")
const AesEncryption = require('aes-encryption')
const keyGen=crypto.createDiffieHellman(2048)
const keyGenVars={prime:keyGen.getPrime("hex"), generator:keyGen.getGenerator("hex"), publicKey:keyGen.generateKeys("hex")}
console.log("[LOG] Generated keys.")
*/
//loading in all the models for the tables for the database
console.log("[LOG] Loading models for table setup for SQLite using Sequelize.")
const models={} 
for(let file of fs.readdirSync('./models').filter(file => file.endsWith('.js'))){
	models[file.replace(".js", "")]=require("./models/"+file)(seq, sequelize.DataTypes)
}
console.log("[LOG] Loaded models.")


//loading in all the post requests from seperate files
console.log("[LOG] Creating all POST request listeners.")
postListeners = {} 
for (const file of fs.readdirSync("./requests").filter(file => file.endsWith('.js'))) {
	const postRequest = require("./requests/"+file);
	if ('data' in postRequest && 'execute' in postRequest) {
		postListeners[postRequest.data.name]=postRequest;
	} else {
		console.log(`[WARN] The postListener at ${file} is missing a required "data" or "execute" property.`);
	}
}

//setting up email transporter
const transporter = mailer.createTransport({
    host: config.email.host,
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: config.email.username, // generated ethereal user
      pass: config.email.password, // generated ethereal password
    },
});

io.on("connection", (socket)=>{
	//socket.emit("handshake", keyGenVars)
	socket.prependAny(async (name, data, res)=>{
		console.log("[LOG] Received request "+name)
		/*if(!Object.keys(postListeners).includes(name)){
			console.error("[ERROR] Event "+name+" is not handeld.")
			return;
		}*/
		try{
			/*if(!socket.aes){
				let key=await keyGen.computeSecret(data.publicKey, "hex", "hex").substring(0, 256)
				socket.aes=new AesEncryption()
				socket.aes.setSecretKey(key)
			}
			if(data.body){
				try{
					let decrypted=await socket.aes.decrypt(data.body)
					data.body=JSON.parse(decrypted.toString("utf8"))
				}catch(e){
					console.error("[ERROR] This socket either hasn't got a public key registered yet, or the key is old. \n", e)
					return
				}
			}*/
			try{
				let data=JSON.parse(data)
			}catch(e){
				console.error("[ERROR] ["+name+"] ", e)
				return res({success:false,error:{code:1, description:"Unable to parse the request data."}})
			}
			return postListeners[name].execute(data, res, socket, io, models, transporter)
		}catch(e){
			console.error("[ERROR REQUEST] "+name+" - \n", e)
			console.error(data)
			return res({success:false,error:{code:0, description:"Unknown server error while processing the request."}})
		}
	})
	
})


console.log("[LOG] Created all listeners.")


server.listen(42069, ()=>{"[LOG] Server started."})

console.log("[LOG] Server started.")