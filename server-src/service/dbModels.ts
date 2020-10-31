import { Sequelize, Model, DataTypes, Optional } from 'sequelize';
import { IRegistration, Rang } from '../@types/iRegistration';
import { IReqUnits } from '../@types/IGuild';
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
	public rang: Rang;

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
			type: new DataTypes.NUMBER(),
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
	allyCode: number;
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
	public isComplete?: boolean;
	public playerName?: string;
}

Unit.init(
	{
		id: { type: DataTypes.NUMBER, autoIncrement: true, primaryKey: true },
		baseId: { type: DataTypes.STRING, allowNull: false },
		power: { type: DataTypes.NUMBER, allowNull: false },
		relic: { type: DataTypes.NUMBER, allowNull: false },
		combatType: { type: DataTypes.NUMBER, allowNull: false },
		gearLevel: { type: DataTypes.NUMBER, allowNull: true },
		name: { type: DataTypes.STRING, allowNull: true },
		level: { type: DataTypes.NUMBER, allowNull: true },
		rarity: { type: DataTypes.NUMBER, allowNull: true },
		health: { type: DataTypes.NUMBER, allowNull: true },
		speed: { type: DataTypes.NUMBER, allowNull: true },
		damage: { type: DataTypes.NUMBER, allowNull: true },
		damageSpecial: { type: DataTypes.NUMBER, allowNull: true },
		defense: { type: DataTypes.NUMBER, allowNull: true },
		criticalChance: { type: DataTypes.NUMBER, allowNull: true },
		criticalChanceSpecial: { type: DataTypes.NUMBER, allowNull: true },
		criticalDamage: { type: DataTypes.NUMBER, allowNull: true },
		potency: { type: DataTypes.NUMBER, allowNull: true },
		tenacity: { type: DataTypes.NUMBER, allowNull: true },
		protection: {
			type: DataTypes.NUMBER,
			allowNull: true
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

export interface IIdeaCreationAttributes {
	id?: number;
	text: string;
	allyCode: number;
	discordId: number;
}

export class Idea extends Model<IIdeaCreationAttributes> implements Idea {
	id!: number;
	text: string;
	allyCode: number;
	discordId: number;
}

Idea.init(
	{
		id: { type: DataTypes.NUMBER, autoIncrement: true, primaryKey: true },
		text: { type: DataTypes.STRING, allowNull: false },
		allyCode: { type: DataTypes.NUMBER, allowNull: true },
		discordId: { type: DataTypes.NUMBER, allowNull: false }
	},
	{
		sequelize,
		tableName: 'Idea',
		timestamps: false
	}
);

export interface IGuildCreationAttributes {
	id?: number;
	name: string;
	guildId: number;
}

export class Guild extends Model<IGuildCreationAttributes> implements Guild {
	id!: number;
	name: string;
	guildId: number;
}

Guild.init(
	{
		id: { type: DataTypes.NUMBER, autoIncrement: true, primaryKey: true },
		name: { type: DataTypes.STRING, allowNull: false },
		guildId: { type: DataTypes.NUMBER, allowNull: false }
	},
	{
		sequelize,
		tableName: 'Guilds',
		timestamps: false
	}
);

export interface IGuildMembersCreationAttributes {
	id?: number;
	allyCode: number;
	guildId: number;
	name: string;
}

export class GuildMembers extends Model<IGuildMembersCreationAttributes>
	implements GuildMembers {
	id!: number;
	allyCode: number;
	guildId: number;
	name: string;
}

GuildMembers.init(
	{
		id: { type: DataTypes.NUMBER, autoIncrement: true, primaryKey: true },
		allyCode: { type: DataTypes.NUMBER, allowNull: true },
		guildId: { type: DataTypes.NUMBER, allowNull: true },
		name: { type: DataTypes.STRING, allowNull: false }
	},
	{
		sequelize,
		tableName: 'GuildMembers',
		timestamps: false
	}
);

export interface ISquadCreationAttributes {
	id?: number;
	squad: string;
	used: number;
	allyCode: string;
}

export class Squad extends Model<ISquadCreationAttributes> implements Squad {
	id!: number;
	squad: string;
	used: number;
	allyCode: string;
}

Squad.init(
	{
		id: { type: DataTypes.NUMBER, autoIncrement: true, primaryKey: true },
		squad: { type: DataTypes.STRING, allowNull: false },
		used: { type: DataTypes.NUMBER, allowNull: true },
		allyCode: { type: DataTypes.NUMBER, allowNull: true }
	},
	{
		sequelize,
		tableName: 'Squad',
		timestamps: true
	}
);
