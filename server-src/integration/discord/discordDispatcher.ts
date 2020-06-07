import { IDiscordChannel, IDiscordMessage } from '../../@types/IDiscord';
import { playerController } from '../../controller/playerController';
import { modController } from '../../controller/modController';
import { discordResultStringifier } from './discordResultStringifier';
import { readWriteService } from '../../service/readWriteService';
import { IRegistration, Rang } from '../../@types/iRegistration';
import { fetchDataService } from '../../service/fetchDataService';

const discordConfig = [
	{
		id: 0,
		key: '-h',
		description: 'usage: swr - h Help about acceptable commands',
		handler: 'help'
	},
	{
		id: 1,
		key: '-r',
		description:
			'usage: swr -r 111222333 Register user ally code for next operations',
		handler: 'register'
	},
	{
		id: 2,
		key: '-cu',
		description: 'usage: swr -cu Find units with weak mod collection',
		handler: 'colorUp'
	},
	{
		id: 3,
		key: '-lp',
		description: 'usage: swr -lp Check Your progress to receive Legends',
		handler: 'legendProgress'
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
	},
	register: async function (
		channel: IDiscordChannel,
		msg: IDiscordMessage
	): Promise<{}> {
		const allyCode: string = getAllyCode(msg.content);
		if (!allyCode) {
			return channel.createMessage(
				'input ally code pls, like: swr -r 111222333'
			);
		}
		if (allyCode.length !== 9) {
			return channel.createMessage(
				'input correct ally code pls, like: swr -r 111222333'
			);
		}
		const allPlayersResp: string = await readWriteService.readJson(
			'registration/registr.json'
		);
		let players: IRegistration[] = await JSON.parse(allPlayersResp);
		const existingPlayer: IRegistration = players.find(
			(player) => player.discordId === msg.author.id
		);
		const player = await fetchDataService.getPlayer(allyCode);
		if (!player) {
			return channel.createMessage(
				'No player with such ally code registered on https://swgoh.gg/'
			);
		}
		if (existingPlayer) {
			existingPlayer.allyCode = allyCode;
			existingPlayer.discordName = msg.author.username;
			existingPlayer.playerName = player.data.name;
		} else {
			players.push({
				discordId: msg.author.id,
				allyCode: allyCode,
				playerName: player.data.name,
				discordName: msg.author.username,
				rang: Rang[Rang.hope]
			});
		}
		await readWriteService.saveJson(players, 'registration/registr.json');
		return channel.createMessage(
			`You have been registered as ${player.data.name}, \n https://swgoh.gg/p/${allyCode}/`
		);
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
			const stringResult = discordResultStringifier.colorUpModsStringify(
				result
			);
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
		const allyCode = await getAllyCodeForRegisteredUser(msg.author.id);
		if (allyCode) {
			const result = await playerController.getLegendProgress(allyCode);
			const stringResult = discordResultStringifier.legendProgressStringify(
				result
			);
			channel.createMessage(stringResult);
		} else {
			channel.createMessage(
				'You are not registered yet.\n Try: \n swr -r allyCode.\n For help: \n swr -h'
			);
		}
	}
};

function getAllyCode(content: string): string {
	return content
		.toLowerCase()
		.replace('swr -r', '')
		.trim()
		.split('-')
		.join('')
		.trim();
}

async function getAllyCodeForRegisteredUser(
	discordId: string
): Promise<string> {
	const allPlayersResp: string = await readWriteService.readJson(
		'registration/registr.json'
	);
	const players: IRegistration[] = await JSON.parse(allPlayersResp);
	const existingPlayer: IRegistration = players.find(
		(player) => player.discordId === discordId
	);
	return existingPlayer ? existingPlayer.allyCode : '';
}
