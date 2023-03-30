const fs=require("fs")
const utils = require("../utils.js")
const config=require("../config.json")
const crypto = require('crypto');
const sequelize = require('sequelize');
const {Op} = sequelize

module.exports = {
	data: {name:"registerUser"},
	async execute(data, res, socket, io, models, transporter){
		try{
			try{
				let data=JSON.parse(data)
			}catch(e){
				return res({success:false,error:{code:1, description:"Unable to parse the request data."}})
				console.error("[ERROR] ["+this.data.name+"] ", e)
			}
			let user=models.findOne({where:{email:data.email, username:data.username, deletedAt:{[Op.ne]:null}}, paranoid:false})
			if(user){
				user.restore()
				socket.user=user
				return res({success:true})
			}else{
				return res({success:false,error:{code:2, description:"The user took too long to verify their email, their space in the database has been unreserved."}})
			}
			
		}catch(e){
			console.error("[ERROR] ["+this.data.name+"] ", e)
			return res({success:false,error:{code:0, description:"Unknown server error while processing the request."}})
		}
	}
}