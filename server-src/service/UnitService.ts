import { IUnitSQL, IUnitSQLCreationAttributes } from './dbModels';
import { IUnit } from '../@types/IUnit';
import { Transformer } from '../helper/transformer';

export const UnitService = {
	create: async function (unit: IUnitSQLCreationAttributes): Promise<boolean> {
		return !!(await IUnitSQL.create(unit));
	},
	update: async function (unit, unitForDb): Promise<boolean> {
		return !!(await unit.update(unitForDb));
	},
	createOrUpdate: async function (allyCode: number, unit: IUnit) {
		const unitForDB = Transformer.fromGameToSQLDB(unit, allyCode);
		console.log('Create, or update Unit ', unitForDB);
		const existUnit = await IUnitSQL.findOne({
			where: {
				allyCode,
				baseId: unit.data.base_id
			}
		});
		if (existUnit) {
			await existUnit.update(unitForDB);
		} else {
			await IUnitSQL.create(unitForDB);
		}
	},
	getPlayerUnitByBaseId: async function (
		allyCode: number,
		baseId
	): Promise<IUnitSQL> {
		return await IUnitSQL.findOne({
			where: {
				allyCode,
				baseId
			}
		});
	},
	getPlayerUnit: async function (allyCode: number): Promise<IUnitSQL> {
		return await IUnitSQL.findOne({
			where: {
				allyCode
			},
			raw: true,
			nest: true
		});
	}
};
