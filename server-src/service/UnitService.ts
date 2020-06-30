import { LegendProgress, LegendProgressCreationAttributes } from './dbModels';

export const UnitService = {
	create: async function (options: LegendProgressCreationAttributes) {
		return await LegendProgress.create({
			base_id: options.base_id,
			power: options.power,
			relic: options.relic || null,
			ship: options.ship || null,
			rarity: options.rarity || null,
			createdAt: options.createdAt || new Date(),
			allyCode: options.allyCode,
			isComplete: options.isComplete
		});
	},
	findUnitByOptions: async function (options) {
		const units: LegendProgress[] = await LegendProgress.findAll(options);
		return units;
	}
};
