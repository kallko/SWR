import { LegendRequirements } from './dbModels';

export const LegendRequirementsService = {
	create: async function (requirements) {
		const newReq = await LegendRequirements.create({
			name: requirements.name,
			base_id: requirements.base_id,
			power: requirements.power,
			relic: requirements.relic || null,
			ship: requirements.ship || null,
			rarity: requirements.rarity || null
		});
	}
};
