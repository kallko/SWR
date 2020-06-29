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
import { IRegistration, Rang } from '../@types/iRegistration';
import { ILegendRequirements, IReqUnits } from '../@types/IGuild';

const sequelize = new Sequelize('swr', 'root', '', {
	host: 'localhost',
	dialect: 'mysql'
});

interface UserCreationAttributes extends Optional<IRegistration, 'id'> {}

export class User extends Model<IRegistration, UserCreationAttributes>
	implements IRegistration {
	public id!: number;
	public playerName!: string;
	public discordId?: string | null;
	public allyCode!: string;
	public discordName?: string | null;
	public rang: keyof typeof Rang;

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
		sequelize
	}
);

export interface LegendRequirementsCreationAttributes
	extends Optional<IReqUnits, 'id'> {
	name: string;
}

export class LegendRequirements
	extends Model<LegendRequirementsCreationAttributes>
	implements IReqUnits {
	public id!: number;
	public base_id!: string;
	public power: number;
	public name: string;
	public ship?: boolean;
	public rarity?: number | null;
	public relic?: number | null;
}

LegendRequirements.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true
		},
		base_id: {
			type: new DataTypes.STRING(32),
			allowNull: false
		},
		power: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		name: {
			type: new DataTypes.STRING(32),
			allowNull: false
		},
		ship: {
			type: DataTypes.BOOLEAN
		},
		rarity: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		relic: {
			type: DataTypes.INTEGER,
			allowNull: true
		}
	},
	{
		tableName: 'LegendRequirements',
		timestamps: false,
		sequelize
	}
);
