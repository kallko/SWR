import { ISquadCreationAttributes, Squad } from './dbModels';

export const squadService = {
	create: async function (options: ISquadCreationAttributes) {
		return await Squad.create(options);
	},
	getBySquad: async function (options) {
		const squads = await Squad.findAll({ where: options });
		for (const squad of squads) {
			await squadService.increaseUsed(squad);
		}
		return squads;
	},
	increaseUsed: async function (squad) {
		return await squad.update({ used: squad.used + 1 });
	}
};
