

const fs=require("fs")
const crypto = require('crypto');
const config=require("./config.json")
const AesEncryption = require('aes-encryption')

module.exports={
	randomNumber(max){
		return Math.floor(Math.random()*max)
	}
}