import { Idea } from './dbModels';

export const ideaService = {
	create: async function (options) {
		const { text, allyCode, discordId } = options;
		const createOptions = {
			text,
			allyCode,
			discordId
		};
		if (options.allyCode) {
			createOptions.allyCode = allyCode;
		}
		return await Idea.create(createOptions);
	}
};
