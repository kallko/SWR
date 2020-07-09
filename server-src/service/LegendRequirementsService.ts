import { LegendRequirements } from './dbModels';

export const LegendRequirementsService = {
	create: async function (requirements) {
		const exist = await LegendRequirements.findAll({
			where: {
				baseId: requirements.baseId
			}
		});
		if (exist?.length === 0){
			return await LegendRequirements.create({
				name: requirements.name,
				baseId: requirements.baseId,
				power: requirements.power,
				relic: requirements.relic || null,
				ship: requirements.ship || null,
				rarity: requirements.rarity || null
			});
		}
	},
	getAll: async function (): Promise<LegendRequirements[]> {
		return await LegendRequirements.findAll({ raw: true, nest: true });
	}
};
