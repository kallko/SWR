import { IDiscordChannel, IDiscordMessage } from '../../@types/IDiscord';
import { Rang } from '../../@types/iRegistration';

import { userService } from '../../service/UserService';
import { fetchDataService } from '../../service/fetchDataService';

import { playerController } from '../../controller/playerController';
import { modController } from '../../controller/modController';
import { guildController } from '../../controller/guildController';

import { discordResultStringifier } from './discordResultStringifier';
import { UnitService } from '../../service/UnitService';
import { TopFieldList } from '../../@types/IUnit';
import { discordHelper } from './discordHelper';
import { discordConfig } from './discordConfig';
import { ideaService } from '../../service/IdeaService';

export const discordDispatcher = {
	dispatch: async function (
		msg: IDiscordMessage,
		channel?: IDiscordChannel
	): Promise<string> {
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
			await channel.createMessage(
				msg.author.username +
					',\n You are not registered yet.\n ' +
					'Try: \n ' +
					'swr -r allyCode.\n ' +
					'For help: \n ' +
					'swr -h'
			);
		}
		if (msg.channel.type === 1 && !msg.author.bot) {
			return discordDispatcher['help'].call(discordDispatcher, channel, msg);
		}
	},
	register: async function (
		channel: IDiscordChannel,
		msg: IDiscordMessage
	): Promise<void> {
		const allyCode: number = getAllyCode(msg.content);
		if (!allyCode || allyCode.toString().length !== 9) {
			await channel.createMessage(
				'input ally code pls, like: swr -r 111222333'
			);
			return;
		}
		const searchOptions = {
			discordId: msg.author.id,
			allyCode
		};
		const existPlayer = await userService.getUser(searchOptions);
		const player = await fetchDataService.getPlayer(allyCode);
		if (!player?.data) {
			await channel.createMessage(
				'No player with such ally code registered on https://swgoh.gg/'
			);
			return;
		}
		if (existPlayer) {
			const options = {
				allyCode: allyCode,
				discordName: msg.author.username,
				playerName: player.data?.name
			};
			await userService.update(options);
			await channel.createMessage(
				`${player.data.name}, your data was updated \n https://swgoh.gg/p/${allyCode}/`
			);
		} else {
			const options = {
				discordId: msg.author.id,
				allyCode: allyCode,
				playerName: player.data.name,
				discordName: msg.author.username,
				rang: Rang[Rang.hope]
			};
			await userService.createUser(options);
			await channel.createMessage(
				`You have been registered as ${player.data.name}, \n https://swgoh.gg/p/${allyCode}/`
			);
		}
	},
	help: async function (
		channel: IDiscordChannel,
		msg: IDiscordMessage
	): Promise<void> {
		const resp: string = discordConfig.reduce(
			(sum, entry) => sum + entry.key + ' ' + entry.description + '\n',
			msg.author.greeting + ' Possible commands: \n'
		);
		channel.createMessage(resp);
	},
	colorUp: async function (
		channel: IDiscordChannel,
		msg: IDiscordMessage
	): Promise<void> {
		if (msg.author.allyCode) {
			const result = await modController.getColorUpMods(msg.author.allyCode);
			const stringResult =
				msg.author.greeting + discordResultStringifier.colorUpMods(result);
			channel.createMessage(stringResult);
		} else {
			await channel.createMessage(
				'You are not registered yet.\n ' +
					'Try: \n ' +
					'swr -r allyCode.\n ' +
					'For help: \n ' +
					'swr -h'
			);
		}
	},
	legendProgress: async function (
		channel: IDiscordChannel,
		msg: IDiscordMessage
	): Promise<void> {
		if (msg.author.allyCode) {
			const result = await playerController.getLegendProgress(
				msg.author.allyCode
			);
			const stringResult =
				msg.author.greeting + discordResultStringifier.legendProgress(result);
			channel.createMessage(stringResult);
		} else {
			channel.createMessage(
				'You are not registered yet.\n Try: \n swr -r allyCode.\n For help: \n swr -h'
			);
		}
	},
	guildList: async function (
		channel: IDiscordChannel,
		msg: IDiscordMessage
	): Promise<void> {
		if (msg.author.allyCode) {
			const result = await guildController.getGuildAll(msg.author.allyCode);
			const stringResult =
				msg.author.greeting + discordResultStringifier.guildList(result);
			channel.createMessage(stringResult);
		} else {
			channel.createMessage(
				'You are not registered yet.\n Try: \n swr -r allyCode.\n For help: \n swr -h'
			);
		}
	},
	guildTop: async function (
		channel: IDiscordChannel,
		msg: IDiscordMessage,
		parameter
	): Promise<void> {
		if (msg.author.allyCode && TopFieldList[parameter.rank]) {
			const result = await UnitService.getGuildTopByField(
				msg.author.allyCode,
				parameter.rank
			);
			const stringResult: string =
				msg.author.greeting +
				' from ' +
				msg.author.guildName +
				'\n TOP UNITS BY ' +
				parameter.rank.toUpperCase() +
				':\n' +
				discordResultStringifier.guildTop(result, parameter.rank);
			channel.createMessage(stringResult);
		} else {
			channel.createMessage(
				msg.author.greeting + ', check command spelling, please.'
			);
		}
	},
	idea: async function (channel: IDiscordChannel, msg: IDiscordMessage, text) {
		if (text?.length > 10) {
			const idea = await ideaService.create({
				discordId: msg.author.id,
				allyCode: msg.author.allyCode,
				text: '!' + text
			});
			channel.createMessage(
				`${msg.author.greeting} thank You for Idea. We have already ${
					idea.id + 1
				} ideas from our users.`
			);
		} else {
			channel.createMessage(
				`${msg.author.greeting} thank You for Idea, but description is to short. Please, give to us more context`
			);
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
