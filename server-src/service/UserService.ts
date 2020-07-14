import { User } from './dbModels';
import { Rang } from '../@types/iRegistration';
import { Op } from 'sequelize';

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
					},
					update: async function (user) {
						const existUser = await User.findOne({
							where: {
								allyCode: user.allyCode
							}
						});
						await existUser.update(user);
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
					}
				};
