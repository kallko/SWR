import { LegendProgress, LegendProgressCreationAttributes } from './dbModels';

export const LegendService = {
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
	findUnitsByOptions: async function (options): Promise<LegendProgress[]> {
		const findOptions = Object.assign(options, { raw: true, nest: true });
		return await LegendProgress.findAll(findOptions);
	}
};
