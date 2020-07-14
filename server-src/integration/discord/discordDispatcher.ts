import { IDiscordChannel, IDiscordMessage } from '../../@types/IDiscord';
import { IRegistration, Rang } from '../../@types/iRegistration';

import { userService } from '../../service/UserService';
import { readWriteService } from '../../service/readWriteService';
import { fetchDataService } from '../../service/fetchDataService';

import { playerController } from '../../controller/playerController';
import { modController } from '../../controller/modController';
import { guildController } from '../../controller/guildController';

import { discordResultStringifier } from './discordResultStringifier';

const discordConfig = [
	{
		id: 0,
		key: '-h',
		description: '   Help. Usage: swr - h Help about acceptable commands',
		handler: 'help'
	},
	{
		id: 1,
		key: '-r',
		description:
			'   Registering. Usage: swr -r 111222333 Register your user ally code for next operations',
		handler: 'register'
	},
	{
		id: 2,
		key: '-cu',
		description:
			' ColorUp. Usage: swr -cu Find mods, wich after color-up, could add more than 20 speed',
		handler: 'colorUp'
	},
	{
		id: 3,
		key: '-lp',
		description:
			' LegendProgress. Usage: swr -lp Check Your progress to receiving Legends',
		handler: 'legendProgress'
	},
	{
		id: 4,
		key: '-gl',
		description:
			' GuildList. usage: swr -gl Returns list of guild members with allycodes, estimated response time 20 sec.',
		handler: 'guildList'
	}
];

export const discordDispatcher = {
	dispatch: function (msg: IDiscordMessage, channel?: IDiscordChannel): string {
		//todo check message here
		const option = discordConfig.find((entry) =>
			msg.content.toLowerCase().replace('swr', '').trim().startsWith(entry.key)
		);
		if (option) {
			return discordDispatcher[option.handler].call(
				discordDispatcher,
				channel,
				msg
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
	help: async function (channel: IDiscordChannel): Promise<void> {
		const resp: string = discordConfig.reduce(
			(sum, entry) => sum + entry.key + ' ' + entry.description + '\n',
			'Possible commands: \n'
		);
		channel.createMessage(resp);
	},
	colorUp: async function (
		channel: IDiscordChannel,
		msg: IDiscordMessage
	): Promise<void> {
		const allyCode = await getAllyCodeForRegisteredUser(msg.author.id);
		if (allyCode) {
			const result = await modController.getColorUpMods(allyCode);
			const stringResult = discordResultStringifier.colorUpMods(result);
			channel.createMessage(stringResult);
		} else {
			channel.createMessage(
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
		const allyCode: number = await getAllyCodeForRegisteredUser(msg.author.id);
		if (allyCode) {
			const result = await playerController.getLegendProgress(allyCode);
			const stringResult = discordResultStringifier.legendProgress(result);
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
		const allyCode = await getAllyCodeForRegisteredUser(msg.author.id);
		if (allyCode) {
			const result = await guildController.getGuildAll(allyCode);
			const stringResult = discordResultStringifier.guildList(result);
			channel.createMessage(stringResult);
		} else {
			channel.createMessage(
				'You are not registered yet.\n Try: \n swr -r allyCode.\n For help: \n swr -h'
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

async function getAllyCodeForRegisteredUser(
	discordId: string
): Promise<number> {
	const allPlayersResp: string = await readWriteService.readJson(
		'registration/registr.json'
	);
	const players: IRegistration[] = await JSON.parse(allPlayersResp);
	const existingPlayer: IRegistration = players.find(
		(player) => player.discordId === discordId
	);
	return existingPlayer ? existingPlayer.allyCode : 0;
}
