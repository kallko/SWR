import { User } from './dbModels';
import { Rang } from '../@types/iRegistration';
import { Op } from 'sequelize';
import { IDiscordMessage } from '../@types/IDiscord';

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
				rang: Rang.hope
			});
		}
	},
	update: async function (user) {
		const { discordId, allyCode } = user;
		const existUser = await User.findOne({
			where: {
				discordId
			}
		});
		return await existUser.update({ allyCode });
	},
	getUser: async function (options) {
		return await User.findOne({
			where: {
				[Op.or]: [
					{ allyCode: options.allyCode },
					{
						discordId: options.discordId
					}
				]
			}
		});
	},
	getUserByAllyCode: async function (options) {
		return await User.findOne({
			where: { allyCode: options.allyCode }
		});
	},
	getUserByDiscordId: async function (discordId): Promise<User> {
		const user = await User.findOne({
			where: {
				discordId
			},
			raw: true,
			nest: true
		});
		return user ? user : null;
	},
	getGreeting: function (user: User, msg: IDiscordMessage): string {
		return `@${msg.author.username}, \n (${
			user?.playerName || 'unknown player'
		})\n`;
	},
	getUsersAllyCode: async function () {
		return await User.findAll({
			attributes: ['allyCode'],
			raw: true,
			nest: true
		});
	}
};
