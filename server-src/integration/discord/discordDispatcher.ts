import {
	IDiscordChannel,
	IDiscordEmbed,
	IDiscordMessage
} from '../../@types/IDiscord';
import { Rang } from '../../@types/iRegistration';

import { userService } from '../../service/UserService';
import { fetchDataService } from '../../service/fetchDataService';

import { playerController } from '../../controller/playerController';
import { modController } from '../../controller/modController';
import { guildController } from '../../controller/guildController';

import { discordResultEmbed } from './discordResultEmbed';
import { UnitService } from '../../service/UnitService';
import { TopFieldList } from '../../@types/IUnit';
import { discordHelper } from './discordHelper';
import { discordConfig } from './discordConfig';
import { ideaService } from '../../service/IdeaService';
import { IIdeaCreationAttributes } from '../../service/dbModels';
import { guildService } from '../../service/guildService';
import { IModEvaluation } from '../../@types/IMod';

export const discordDispatcher = {
	dispatch: async function (
		bot: any,
		msg: IDiscordMessage,
		channel?: IDiscordChannel
	): Promise<IDiscordEmbed> {
		//todo check message here
		console.log('msg.content ', msg.content);
		const option = discordConfig.find((entry) =>
			msg.content.toLowerCase().replace('swr', '').trim().startsWith(entry.key)
		);
		const user = await userService.getUserByDiscordId(msg.author.id);
		msg.author.allyCode = user?.allyCode || null;
		msg.author.greeting = userService.getGreeting(user, msg);
		console.log('input ', option, user);
		if ((option && user?.allyCode) || option?.id < 10) {
			msg.addReaction('👍');
			const parameters =
				option?.id >= 10
					? discordHelper.getParameters(
							msg.content.toLowerCase().replace('swr', '').trim(),
							option.key
					  )
					: msg.content
							.toLowerCase()
							.replace('swr', '')
							.trim()
							.replace(option?.key, '');
			return discordDispatcher[option?.handler].call(
				discordDispatcher,
				channel,
				msg,
				parameters
			);
		} else if (option && option.id !== 0 && !user) {
			msg.addReaction('🤔');
			return discordResultEmbed.notRegistered(msg);
		}
		if (msg.channel?.type === 1 && !msg.author?.bot) {
			msg.addReaction('❌');
			return discordDispatcher['help'].call(discordDispatcher, channel, msg);
		}
		return discordDispatcher['help'].call(discordDispatcher, channel, msg);
	},
	register: async function (
		channel: IDiscordChannel,
		msg: IDiscordMessage
	): Promise<IDiscordEmbed> {
		const allyCode: number = getAllyCode(msg.content);
		if (!allyCode || allyCode.toString().length !== 9) {
			const text = 'input ally code pls, like: swr -r 111222333';
			return discordResultEmbed.notRegistered(msg, text);
		}
		const searchOptions = {
			discordId: msg.author.id,
			allyCode
		};
		const existPlayer = await userService.getUser(searchOptions);
		const player = await fetchDataService.getPlayer(allyCode);
		if (!player?.data) {
			const text =
				'No player with such ally code registered on https://swgoh.gg/';
			return discordResultEmbed.notRegistered(msg, text);
		}
		if (existPlayer) {
			const options = {
				allyCode: allyCode,
				discordName: msg.author.username,
				playerName: player.data?.name,
				discordId: msg.author.id
			};
			const newPlayer = await userService.update(options);
			return discordResultEmbed.registered(newPlayer.playerName, allyCode);
		} else {
			const options = {
				discordId: msg.author.id,
				allyCode: allyCode,
				playerName: player.data.name,
				discordName: msg.author.username,
				rang: Rang[Rang.hope]
			};
			await userService.createUser(options);
			await guildService.updateGuildMember(
				allyCode,
				player.data.guild_id,
				player.data.name
			);
			setTimeout(async function () {
				await guildController.updateData();
				await guildController.updateData();
			}, 100);
			return discordResultEmbed.registered(player.data.name, allyCode);
		}
	},
	help: function (
		channel: IDiscordChannel,
		msg: IDiscordMessage
	): IDiscordEmbed {
		return discordResultEmbed.help(msg);
	},
	colorUp: async function (
		channel: IDiscordChannel,
		msg: IDiscordMessage
	): Promise<IDiscordEmbed> {
		if (msg.author.allyCode) {
			const result = await modController.getColorUpMods(msg.author.allyCode);
			return discordResultEmbed.colorUpMods(result, msg);
		} else {
			return discordResultEmbed.notRegistered(msg);
		}
	},
	legendProgress: async function (
		channel: IDiscordChannel,
		msg: IDiscordMessage
	): Promise<IDiscordEmbed> {
		if (msg.author.allyCode) {
			const result = await playerController.getLegendProgress(
				msg.author.allyCode
			);
			return discordResultEmbed.legendProgress(result, msg);
		} else {
			return discordResultEmbed.notRegistered(msg);
		}
	},
	guildList: async function (
		channel: IDiscordChannel,
		msg: IDiscordMessage
	): Promise<IDiscordEmbed> {
		if (msg.author.allyCode) {
			const result = await guildController.getGuildAll(msg.author.allyCode);
			return discordResultEmbed.guildList(result, msg);
		} else {
			return discordResultEmbed.notRegistered(msg);
		}
	},
	guildTop: async function (
		channel: IDiscordChannel,
		msg: IDiscordMessage,
		parameter
	): Promise<IDiscordEmbed> {
		if (!parameter?.rank) {
			return discordResultEmbed.noParameter(msg);
		}
		if (msg.author.allyCode && TopFieldList[parameter.rank]) {
			const result = await UnitService.getGuildTopByField(
				msg.author.allyCode,
				parameter.rank
			);
			return discordResultEmbed.guildTop(result, parameter.rank, msg);
		} else {
			return discordResultEmbed.notRegistered(msg);
		}
	},
	idea: async function (channel: IDiscordChannel, msg: IDiscordMessage, text) {
		if (text?.length > 10) {
			const idea: IIdeaCreationAttributes = await ideaService.create({
				discordId: msg.author.id,
				allyCode: msg.author.allyCode,
				text: '!' + text
			});
			const embedResult: IDiscordEmbed = discordResultEmbed.ideaCreated(
				true,
				msg,
				idea
			);
			return embedResult;
		} else {
			const embedResult: IDiscordEmbed = discordResultEmbed.ideaCreated(
				false,
				msg,
				{
					text,
					discordId: Number(msg.author.id),
					allyCode: msg.author.allyCode
				}
			);
			return embedResult;
		}
	},
	arenaMods: async function (
		channel: IDiscordChannel,
		msg: IDiscordMessage
	): Promise<IDiscordEmbed> {
		try {
			const result = await modController.creator(msg.author.allyCode);
			if (!result) {
				throw new Error('Creation mod set return Error');
			}
			return discordResultEmbed.arenaMods(result, msg);
		} catch (err) {
			return discordResultEmbed.error(err, msg);
		}
	},
	modEvolution: async function (
		channel: IDiscordChannel,
		msg: IDiscordMessage,
		parameters
	): Promise<IDiscordEmbed> {
		try {
			const modsForEvolution: {
				result: IModEvaluation[];
				baseId: string;
			} = await modController.getModForEvolution(
				msg.author.allyCode,
				parameters
			);
			return discordResultEmbed.modEvolution(
				modsForEvolution.result,
				msg,
				modsForEvolution.baseId
			);
		} catch (err) {
			return discordResultEmbed.error(err, msg);
		}
	}
};

function getAllyCode(content: string): number {
	return parseInt(
		content
			.toLowerCase()
			.replace('swr -r', '')
			.trim()
			.split('-')
			.join('')
			.trim()
	);
}
