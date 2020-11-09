import { ISquadCreationAttributes, Squad } from './dbModels';
import { Op } from 'sequelize';

export const squadService = {
	create: async function (options: ISquadCreationAttributes) {
		return await Squad.create(options);
	},
	getBySquad: async function (options, allyCode?: number) {
		let searchOptions = {};
		if (allyCode) {
			searchOptions = {
				where: {
					[Op.or]: [{ allyCode: null }, { allyCode }],
					squad: options.squad
				},
				order: [
					['allyCode', 'DESC'],
					['createdAt', 'DESC']
				]
			};
		} else {
			searchOptions = {
				where: {
					[Op.and]: [
						{ allyCode: null },
						{
							squad: options.squad
						}
					]
				},
				order: [['createdAt', 'DESC']]
			};
		}
		const squads = await Squad.findAll(searchOptions);
		for (const squad of squads) {
			await squadService.increaseUsed(squad);
		}
		return squads;
	},
	increaseUsed: async function (squad) {
		return await squad.update({ used: squad.used + 1 });
	}
};
