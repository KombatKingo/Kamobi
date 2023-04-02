const fs=require("fs")
const utils = require("../utils.js")
const config=require("../config.json")
const crypto = require('crypto');
const sequelize = require('sequelize');

module.exports = {
	data: {name:"keyExchange"},
	async execute(data, socket, io, models, keyGen){
		try{
			console.log("[LOG] Sent keyGen info.")
			return res
		}catch(e){
			console.error("[ERROR] ["+this.data.name+"] ", e)
			return res({error:{code:0, description:"Unknown server error while processing the request."}})
		}
	}
}