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

export const discordDispatcher = {
	dispatch: async function (
		bot: any,
		msg: IDiscordMessage,
		channel?: IDiscordChannel
	): Promise<IDiscordEmbed> {
		//todo check message here
		const option = discordConfig.find((entry) =>
			msg.content.toLowerCase().replace('swr', '').trim().startsWith(entry.key)
		);
		const user = await userService.getUserByDiscordId(msg.author.id);
		msg.author.allyCode = user?.allyCode || null;
		msg.author.greeting = userService.getGreeting(user, msg);
		if ((option && user?.allyCode) || option?.id < 10) {
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
							.replace(option.key, '');
			return discordDispatcher[option.handler].call(
				discordDispatcher,
				channel,
				msg,
				parameters
			);
		} else if (option && option.id !== 0 && !user.allyCode) {
			return discordResultEmbed.notRegistered();
		}
		if (msg.channel.type === 1 && !msg.author.bot) {
			return discordDispatcher['help'].call(discordDispatcher, channel, msg);
		}
	},
	register: async function (
		channel: IDiscordChannel,
		msg: IDiscordMessage
	): Promise<IDiscordEmbed> {
		const allyCode: number = getAllyCode(msg.content);
		if (!allyCode || allyCode.toString().length !== 9) {
			const text = 'input ally code pls, like: swr -r 111222333';
			return discordResultEmbed.notRegistered(text);
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
			return discordResultEmbed.notRegistered(text);
		}
		if (existPlayer) {
			const options = {
				allyCode: allyCode,
				discordName: msg.author.username,
				playerName: player.data?.name
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
			return discordResultEmbed.registered(player.data.name, allyCode);
		}
	},
	help: async function (
		channel: IDiscordChannel,
		msg: IDiscordMessage
	): Promise<IDiscordEmbed> {
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
			return discordResultEmbed.notRegistered();
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
			return discordResultEmbed.notRegistered();
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
			return discordResultEmbed.notRegistered();
		}
	},
	guildTop: async function (
		channel: IDiscordChannel,
		msg: IDiscordMessage,
		parameter
	): Promise<IDiscordEmbed> {
		if (msg.author.allyCode && TopFieldList[parameter.rank]) {
			const result = await UnitService.getGuildTopByField(
				msg.author.allyCode,
				parameter.rank
			);
			return discordResultEmbed.guildTop(result, parameter.rank, msg);
		} else {
			return discordResultEmbed.notRegistered();
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
