import {
	Sequelize,
	Model,
	DataTypes,
	HasManyGetAssociationsMixin,
	HasManyAddAssociationMixin,
	HasManyHasAssociationMixin,
	Association,
	HasManyCountAssociationsMixin,
	HasManyCreateAssociationMixin,
	Optional
} from 'sequelize';

const sequelize = new Sequelize('swr', 'root', '', {
	host: 'localhost',
	dialect: 'mysql'
});

interface UserAttributes {
	id: number;
	playerName: string;
	discordId?: string;
	allyCode: string;
	discordName?: string;
	rang?: string;
}

// Some attributes are optional in `User.build` and `User.create` calls
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserCreationAttributes>
	implements UserAttributes {
	public id!: number;
	public playerName!: string;
	public discordId?: string | null;
	public allyCode!: string;
	public discordName?: string | null;
	public rang: string;

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

User.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true
		},
		playerName: {
			type: new DataTypes.STRING(64),
			allowNull: false
		},
		discordName: {
			type: new DataTypes.STRING(64),
			allowNull: true
		},
		discordId: {
			type: new DataTypes.STRING(16),
			allowNull: true
		},
		allyCode: {
			type: new DataTypes.STRING(32),
			allowNull: true
		},
		rang: {
			type: new DataTypes.STRING(32),
			allowNull: false
		}
	},
	{
		tableName: 'User',
		sequelize // passing the `sequelize` instance is required
	}
);

export async function createUser(user) {
	const newUser = await User.create({
		playerName: user.playerName,
		allyCode: user.allyCode,
		discordName: user.discordName,
		discordId: user.discordId,
		rang: 'hope'
	});
	console.log(newUser.id, newUser.playerName, newUser.allyCode);
}

// export async function doStuffWithUser() {
// 	const newUser = await User.create({
// 		name: 'Johnny',
// 		preferredName: 'John'
// 	});
// 	console.log(newUser.id, newUser.name, newUser.preferredName);
//
// 	const project = await newUser.createProject({
// 		name: 'first!'
// 	});
//
// 	const ourUser = await User.findByPk(1, {
// 		include: [User.associations.projects],
// 		rejectOnEmpty: true // Specifying true here removes `null` from the return type!
// 	});
//
// 	// Note the `!` null assertion since TS can't know if we included
// 	// the model or not
// 	console.log(ourUser.projects![0].name);
// }
