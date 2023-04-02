const fs=require("fs")
const utils = require("../utils.js")
const config=require("../config.json")
const crypto = require('crypto');
const sequelize = require('sequelize');

module.exports = {
	data: {name:"emailConfirmation"},
	async execute(data, res, socket, io, models, transporter){
		try{
			let code=""+utils.randomNumber(10)+utils.randomNumber(10)+utils.randomNumber(10)+utils.randomNumber(10)
			if(await models.users.findOne({where:{email:data.email}})){
				return res({success:false,error:{code:2, description:"User with that email already exists."}})
			}
			if(await models.users.findOne({where:{username:data.username}})){
				return res({success:false,error:{code:3, description:"User with that username already exists."}})
			}
			let user=await models.users.create({username:data.username, password:data.password, email:data.email})
			console.log("[LOG] Sending code to: "+data.email)
			let info = await transporter.sendMail({
				from: 'KamobiApp@noreply.hr', // sender address
				to: data.email, // list of receivers
				subject: "Email verification code", // Subject line
				text: "Here is your email verification code: "+code, // plain text body
				//html: "<b>Hello world?</b>", // html body
			},(err, info)=>{
				if(err){console.log(err)}
			});
			setTimeout(()=>{if(!user.confirmedEmail){try{user.destroy()}catch{}}}, 5*60*1000)
			return res({success:true,code:code})
		}catch(e){
			console.error("[ERROR] ["+this.data.name+"] ", e)
			return res({success:false,error:{code:0, description:"Unknown server error while processing the request."}})
		}
	}
}