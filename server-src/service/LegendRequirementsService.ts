import { LegendRequirements } from './dbModels';
import { ILegendRequirements } from '../@types/IGuild';

export const LegendRequirementsService = {
	create: async function (requirements) {
		return await LegendRequirements.create({
			name: requirements.name,
			base_id: requirements.base_id,
			power: requirements.power,
			relic: requirements.relic || null,
			ship: requirements.ship || null,
			rarity: requirements.rarity || null
		});
	},
	getAll: async function (): Promise<LegendRequirements[]> {
		return await LegendRequirements.findAll({ raw: true, nest: true });
	}
};
