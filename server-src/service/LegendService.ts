import {
	LegendProgress,
	LegendProgressCreationAttributes,
	LegendRequirements
} from './dbModels';
import { Op } from 'sequelize';

export const LegendService = {
	create: async function (options: LegendProgressCreationAttributes) {
		return await LegendProgress.create({
			baseId: options.baseId,
			power: options.power,
			relic: options.relic || null,
			ship: options.ship || null,
			rarity: options.rarity || null,
			createdAt: options.createdAt || new Date(),
			allyCode: options.allyCode,
			isComplete: options.isComplete
		});
	},
	findUnitsByOptions: async function (options): Promise<LegendProgress[]> {
		if (!options.baseId) {
			return null;
		}
		const findOptions = Object.assign(options, { raw: true, nest: true });
		return await LegendProgress.findAll(findOptions);
	},
	getDateForWeekUpdate: async function (
		allyCode: number
	): Promise<{ createdAt: Date }> {
		return await LegendProgress.findOne({
			where: {
				allyCode,
				createdAt: {
					[Op.lte]: new Date().setDate(new Date().getDate() - 7)
				}
			},
			raw: true,
			nest: true,
			attributes: ['createdAt'],
			order: [['createdAt', 'DESC']],
			group: ['createdAt']
		});
	},
	getUnitsCreatedInTenSecondsInterval: async function (
		allyCode: number,
		date: Date
	): Promise<LegendProgress[]> {
		return LegendProgress.findAll({
			where: {
				allyCode,
				createdAt: {
					[Op.gte]: date.setSeconds(date.getSeconds() - 5),
					[Op.lte]: date.setSeconds(date.getSeconds() + 10)
				}
			},
			raw: true,
			nest: true
		});
	},
	getUnitsForLegends: async function (): Promise<LegendRequirements[]> {
		return await LegendRequirements.findAll({
			raw: true,
			nest: true
		});
	}
};
