import { Unit, IUnitSQLCreationAttributes } from './dbModels';
import { IImportUnit } from '../@types/IUnit';
import { Transformer } from '../helper/transformer';
import { Op } from 'sequelize';
import { guildController } from '../controller/guildController';
import { IGuild } from '../@types/IGuild';

export const UnitService = {
	create: async function (unit: IUnitSQLCreationAttributes): Promise<boolean> {
		return !!(await Unit.create(unit));
	},
	update: async function (unit, unitForDb): Promise<boolean> {
		return !!(await unit.update(unitForDb));
	},
	createOrUpdate: async function (allyCode: number, unit: IImportUnit) {
		const unitForDB = Transformer.fromGameToSQLDB(unit, allyCode);
		const existUnit = await Unit.findOne({
			where: {
				allyCode,
				baseId: unit.data.base_id
			}
		});
		if (existUnit) {
			await existUnit.update(unitForDB);
		} else {
			await Unit.create(unitForDB);
		}
	},
	getPlayerUnitByBaseId: async function (
		allyCode: number,
		baseId
	): Promise<Unit> {
		return await Unit.findOne({
			where: {
				allyCode,
				baseId
			}
		});
	},
	getPlayerUnitsByBaseId: async function (
		allyCode: number,
		baseIds: string[]
	): Promise<Unit[]> {
		return await Unit.findAll({
			where: {
				allyCode,
				baseId: { [Op.in]: baseIds }
			}
		});
	},
	getPlayerUnit: async function (allyCode: number): Promise<Unit> {
		return await Unit.findOne({
			where: {
				allyCode
			},
			raw: true,
			nest: true
		});
	},
	getAllPlayerUnits: async function (allyCode: number): Promise<Unit[]> {
		return await Unit.findAll({
			where: {
				allyCode
			},
			raw: true,
			nest: true
		});
	},
	getGuildTopByField: async function (
		allyCode: number,
		field: string
	): Promise<any> {
		const guild: IGuild = await guildController.getGuildAll(allyCode);
		const guildIds = guild.members.map((member) => member.id);
		const allyCodes = guildIds || [allyCode];
		const units = await Unit.findAll({
			where: {
				allyCode: {
					[Op.in]: allyCodes
				},
				combatType: 1
			},
			order: [[field, 'DESC']],
			limit: 10,
			raw: true,
			nest: true
		});
		return units.map((unit) =>
			Object.assign(unit, {
				playerName: guild.members.find((member) => member.id === unit.allyCode)
					.name
			})
		);
	}
};
