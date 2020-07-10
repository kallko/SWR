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
import { config } from '../config/config';

const sequelize = new Sequelize('swr', 'root', config.MySQL.password, {
	host: 'localhost',
	dialect: 'mysql'
});

interface UserCreationAttributes extends Optional<IRegistration, 'id'> {}

export class User extends Model<IRegistration, UserCreationAttributes>
	implements IRegistration {
	public id!: number;
	public playerName!: string;
	public discordId?: string | null;
	public allyCode!: number;
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
		tableName: 'Users',
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
	public baseId!: string;
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
		baseId: {
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

export interface LegendProgressCreationAttributes
	extends Optional<IReqUnits, 'id'> {
	createdAt: Date;
	allyCode: string;
	isComplete: boolean;
}

export class LegendProgress extends Model<LegendProgressCreationAttributes>
	implements IReqUnits {
	public id!: number;
	public baseId!: string;
	public power: number;
	public ship?: boolean;
	public rarity?: number | null;
	public relic?: number | null;
	public createdAt: Date;
	public allyCode: string;
	public isComplete: boolean;
}

LegendProgress.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true
		},
		allyCode: {
			type: new DataTypes.STRING(32),
			allowNull: false
		},
		baseId: {
			type: new DataTypes.STRING(32),
			allowNull: false
		},
		power: {
			type: DataTypes.INTEGER,
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
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false
		},
		isComplete: {
			type: DataTypes.BOOLEAN
		}
	},
	{
		tableName: 'LegendProgress',
		timestamps: false,
		sequelize
	}
);

export interface IUnitSQLCreationAttributes {
	id?: number;
	baseId: string;
	power: number;
	relic: number;
	combatType: number;
	gearLevel: number;
	name: string;
	level: number;
	rarity: number;
	health: number;
	speed: number;
	damage: number;
	damageSpecial: number;
	defense: number;
	criticalChance: number;
	criticalChanceSpecial: number;
	criticalDamage: number;
	potency: number;
	tenacity: number;
	protection: number;
	allyCode: number;
	updatedAt: Date;
}

export class Unit extends Model<IUnitSQLCreationAttributes> implements Unit {
	public id!: number;
	public baseId: string;
	public power: number;
	public relic: number;
	public combatType: number;
	public gearLevel: number;
	public name: string;
	public level: number;
	public rarity: number;
	public health: number;
	public speed: number;
	public damage: number;
	public damageSpecial: number;
	public defense: number;
	public criticalChance: number;
	public criticalChanceSpecial: number;
	public criticalDamage: number;
	public potency: number;
	public tenacity: number;
	public protection: number;
	public allyCode: number;
	public updatedAt: Date;
	isComplete?: boolean;
}

Unit.init(
	{
		id: { type: DataTypes.NUMBER, autoIncrement: true, primaryKey: true },
		baseId: { type: DataTypes.STRING, allowNull: false },
		power: { type: DataTypes.NUMBER, allowNull: false },
		relic: { type: DataTypes.NUMBER, allowNull: false },
		combatType: { type: DataTypes.NUMBER, allowNull: false },
		gearLevel: { type: DataTypes.NUMBER, allowNull: false },
		name: { type: DataTypes.STRING, allowNull: false },
		level: { type: DataTypes.NUMBER, allowNull: false },
		rarity: { type: DataTypes.NUMBER, allowNull: false },
		health: { type: DataTypes.NUMBER, allowNull: false },
		speed: { type: DataTypes.NUMBER, allowNull: false },
		damage: { type: DataTypes.NUMBER, allowNull: false },
		damageSpecial: { type: DataTypes.NUMBER, allowNull: false },
		defense: { type: DataTypes.NUMBER, allowNull: false },
		criticalChance: { type: DataTypes.NUMBER, allowNull: false },
		criticalChanceSpecial: { type: DataTypes.NUMBER, allowNull: false },
		criticalDamage: { type: DataTypes.NUMBER, allowNull: false },
		potency: { type: DataTypes.NUMBER, allowNull: false },
		tenacity: { type: DataTypes.NUMBER, allowNull: false },
		protection: {
			type: DataTypes.NUMBER,
			allowNull: false
		},
		allyCode: {
			type: DataTypes.NUMBER,
			allowNull: false
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false
		}
	},
	{
		sequelize,
		tableName: 'Units',
		timestamps: false
	}
);
