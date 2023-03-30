const fs=require("fs")
const utils = require("../utils.js")
const config=require("../config.json")
const crypto = require('crypto');
const sequelize = require('sequelize');+

module.exports = {
	data: {name:"emailConfirmation"},
	async execute(data, res, socket, io, models, transporter){
		try{
			let code=""+utils.randomNumber(10)+utils.randomNumber(10)+utils.randomNumber(10)+utils.randomNumber(10)
			if(models.findOne({where:{email:data.email}})){
				return res({success:false,error:{code:2, description:"User with that email already exists."}})
			}
			if(models.findOne({where:{username:data.username}})){
				return res({success:false,error:{code:3, description:"User with that username already exists."}})
			}
			let user=await models.users.create({username:data.username, password:data.password, email:data.email})
			await user.destroy() //user will be paranoid deleted until they confirm their email.
			let info = await transporter.sendMail({
				from: '"Kamobi" <'+config.email.username+'>', // sender address
				to: data.email, // list of receivers
				subject: "Email verification code", // Subject line
				text: "Here is your email verification code: "+code, // plain text body
				//html: "<b>Hello world?</b>", // html body
			});
			return res({success:true,code:code)
		}catch(e){
			console.error("[ERROR] ["+this.data.name+"] ", e)
			return res({success:false,error:{code:0, description:"Unknown server error while processing the request."}})
		}
	}
}