const fetch = require("node-fetch")
module.exports={
	randomNumber(max){
		return Math.floor(Math.random()*max)
	},
	async sendSMS(service_id, api_key, phone_number, targets, content){

		const resp = await fetch(
			'https://us.sms.api.sinch.com/xms/v1/' + service_id + '/batches',
			{
			  method: 'POST',
			  headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + api_key,
			  },
			  body: JSON.stringify({
				from: phone_number,
				to: targets,
				body: content
			  })
			}
		  );
		const data = await resp.json();
		return data
	}
}