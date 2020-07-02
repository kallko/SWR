import { Unit, IUnitSQLCreationAttributes } from './dbModels';
import { IImportUnit } from '../@types/IUnit';
import { Transformer } from '../helper/transformer';

export const UnitService = {
	create: async function (unit: IUnitSQLCreationAttributes): Promise<boolean> {
		return !!(await Unit.create(unit));
	},
	update: async function (unit, unitForDb): Promise<boolean> {
		return !!(await unit.update(unitForDb));
	},
	createOrUpdate: async function (allyCode: number, unit: IImportUnit) {
		const unitForDB = Transformer.fromGameToSQLDB(unit, allyCode);
		console.log('Create, or update Unit ', unitForDB);
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
	getPlayerUnit: async function (allyCode: number): Promise<Unit> {
		return await Unit.findOne({
			where: {
				allyCode
			},
			raw: true,
			nest: true
		});
	}
};
