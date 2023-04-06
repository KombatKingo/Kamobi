

module.exports = (sequelize, DataTypes) => {
	return sequelize.define('ratings', {
		user_id: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		place_id: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		rating: {
			type: DataTypes.DECIMAL,
			allowNull: false,
		},
		
		
	}, {
		timestamps: false,
	});
};