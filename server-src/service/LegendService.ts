import {
	LegendProgress,
	LegendProgressCreationAttributes,
	LegendRequirements
} from './dbModels';
import { Op } from 'sequelize';
import { LegendRequirementsService } from './LegendRequirementsService';

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
	createOrUpdate: async function (
		options: LegendProgressCreationAttributes
	): Promise<object> {
		const existUnit = await LegendProgress.findOne({
			where: {
				allyCode: options.allyCode,
				baseId: options.baseId,
				createdAt: options.createdAt
			}
		});
		if (existUnit) {
			return await existUnit.update(options);
		}
		return await LegendProgress.create(options);
	},
	findUnitsByOptions: async function (options): Promise<LegendProgress[]> {
		if (!options.baseId) {
			return null;
		}
		const findOptions = Object.assign(options, { raw: true, nest: true });
		return await LegendProgress.findAll(findOptions);
	},
	getDateFromPastInterval: async function (
		allyCode: number,
		interval: number,
		legendBaseId: string
	): Promise<{ createdAt: Date }> {
		const LEGEND_REQUIREMENTS = await LegendRequirementsService.getAll();
		const legendDBUnits: LegendRequirements[] = LEGEND_REQUIREMENTS.filter(
			(LR) => LR.name === legendBaseId
		);
		return await LegendProgress.findOne({
			where: {
				baseId: legendDBUnits[1].baseId,
				allyCode,
				createdAt: {
					[Op.gte]: new Date().setDate(new Date().getDate() - interval)
				}
			},
			raw: true,
			nest: true,
			attributes: ['createdAt'],
			order: [['createdAt', 'ASC']],
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
	},
	getUnitsForLegendsByName: async function (
		name: string
	): Promise<LegendRequirements[]> {
		return await LegendRequirements.findAll({
			where: {
				name
			},
			raw: true,
			nest: true
		});
	},
	getLegendNames: async function (): Promise<any[]> {
		return await LegendRequirements.findAll({
			group: ['name'],
			attributes: ['name'],
			raw: true,
			nest: true
		});
	},
	clearOldData: async function (): Promise<void> {
		await LegendProgress.destroy({
			where: {
				createdAt: {
					[Op.lte]: new Date().setDate(new Date().getDate() - 60)
				}
			}
		});
	}
};
