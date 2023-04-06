const fs=require("fs")
const utils = require("../utils.js")
const config=require("../config.json")
const crypto = require('crypto');
const sequelize = require('sequelize');

module.exports = {
	data: {name:"SMSConfirmation"},
	async execute(data, res, socket, io, models, transporter){
		try{
			let code=""+utils.randomNumber(10)+utils.randomNumber(10)+utils.randomNumber(10)+utils.randomNumber(10)
			//let code="0000"
			if(await models.users.findOne({where:{phoneNumber:data.phoneNumber}})){
				return res({success:false,error:{code:2, description:"User with that phone number already exists."}})
			}
			if(await models.users.findOne({where:{username:data.username}})){
				return res({success:false,error:{code:3, description:"User with that username already exists."}})
			}
			let user=await models.users.create({username:data.username, password:data.password, phoneNumber:data.phoneNumber})
			console.log("[LOG] Sending code to: "+data.phoneNumber)
			
			let sms_response = await utils.sendSMS(config.sms.service_plan_id, config.sms.api_key, config.sms.phone_number, [user.phoneNumber.replace("+", "")], "Your Kamobi verification code is: "+code)
			setTimeout(async ()=>{
				await user.reload()
				try{
					if(!user.confirmedSMS){
						user.destroy()
					}
				}catch{}
			}, 5*60*1000)
			return res({success:true,code:code})
		}catch(e){
			console.error("[ERROR] ["+this.data.name+"] ", e)
			return res({success:false,error:{code:0, description:"Unknown server error while processing the request."}})
		}
	}
}