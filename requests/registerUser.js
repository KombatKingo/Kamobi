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
			let user=await models.users.findOne({where:{email:data.email, username:data.username,},})
			if(user){
				user.confirmedEmail=true
				await user.save()
				return res({success:true})
			}else{
				return res({success:false,error:{code:2, description:"Took too long to confirm your email, try registering again."}})
			}
			
		}catch(e){
			console.error("[ERROR] ["+this.data.name+"] ", e)
			return res({success:false,error:{code:0, description:"Unknown server error while processing the request."}})
		}
	}
}