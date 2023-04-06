

module.exports = (sequelize, DataTypes) => {
	return sequelize.define('restaurants', {
		place_id: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true,
		},
		tags: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		address: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		business_status: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		working_hours: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		delivery: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
		},
		dine_in: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
		},
		takeout: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
		},
		photo_references: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		price_level:{
			type: DataTypes.INTEGER,
			allowNull:false,
		},
		google_rating:{
			type: DataTypes.DECIMAL,
			allowNull:false,
		},
		kamobi_rating:{
			type: DataTypes.DECIMAL,
			allowNull:true,
		},
		phone_number: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		website: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		url:{
			type: DataTypes.STRING,
			allowNull: false,
		},
		location:{
			type: DataTypes.STRING,
			allowNull: false,
		},
		
		
	}, {
		timestamps: false,
	});
};