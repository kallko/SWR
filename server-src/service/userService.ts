import { User } from './dbModels';
import { Rang } from '../@types/iRegistration';



export const userService = {
	createUser: async function(user){
		const newUser = await User.create({
			playerName: user.playerName,
			allyCode: user.allyCode,
			discordName: user.discordName,
			discordId: user.discordId,
			rang: Rang[Rang.hope]
		});
		console.log(newUser.id, newUser.playerName, newUser.allyCode);
	}
};
