const fs=require("fs")
const utils = require("../utils.js")
const config=require("../config.json")
const crypto = require('crypto');
const sequelize = require('sequelize');

module.exports = {
	data: {name:"testRequest"},
	async execute(data, res, socket, io, models, transporter){
		try{
			socket.emit("testRequest", "this is a test")
			return res(`answer to your test, sire`)
		}catch(e){
			console.error("[ERROR] ["+this.data.name+"] ", e)
			return res({error:{code:0, description:"Unknown server error while processing the request."}})
		}
	}
}