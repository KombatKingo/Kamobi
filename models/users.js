

module.exports = (sequelize, DataTypes) => {
	return sequelize.define('users', {
		username: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		phoneNumber: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		confirmedSMS: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		
	}, {
		timestamps: false,
	});
};