const fs=require("fs")
const utils = require("../utils.js")
const config=require("../config.json")
const crypto = require('crypto');
const sequelize = require('sequelize');
const {Op} = sequelize

module.exports = {
	data: {name:"loginUser"},
	async execute(data, res, socket, io, models, transporter){
		try{
			let user=await models.users.findOne({where:{[Op.or]:{email:data.loginname, username:data.loginname,}, password:data.password}})
			if(user){
				socket.user=user
				return res({success:true, username:user.username, email:user.email, confirmedEmail:user.confirmedEmail})
			}else{
				return res({success:false,error:{code:2, description:"No user with that username/email and password exists."}})
			}
			
		}catch(e){
			console.error("[ERROR] ["+this.data.name+"] ", e)
			return res({success:false,error:{code:0, description:"Unknown server error while processing the request."}})
		}
	}
}