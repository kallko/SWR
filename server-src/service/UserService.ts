import { User } from './dbModels';
import { Rang } from '../@types/iRegistration';

export const userService = {
	createUser: async function (user) {
		const exist = await User.findAll({
			where: {
				allyCode: user.allyCode
			}
		});
		if (exist?.length === 0) {
			await User.create({
				playerName: user.playerName,
				allyCode: user.allyCode,
				discordName: user.discordName,
				discordId: user.discordId,
				rang: Rang[Rang.hope]
			});
		}
	}
};
