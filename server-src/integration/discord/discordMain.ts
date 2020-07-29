import {
	IDiscordChannel,
	IDiscordEmbed,
	IDiscordMessage
} from '../../@types/IDiscord';
import { config } from '../../config/config';
import { discordDispatcher } from './discordDispatcher';
import { discordResultEmbed } from './discordResultEmbed';
let masterChannel: IDiscordChannel;
const eris = require('eris');

const bot = new eris.Client(config.discordToken);

bot.on('ready', async () => {
	masterChannel = await bot.getDMChannel(config.discordMasterId);
	masterChannel.createMessage(
		process.env.NODE_ENV + ' Server started: ' + new Date().toLocaleString()
	);
	await bot.editStatus('online', { name: 'swr -h', type: 0 });
});

bot.on(
	'messageCreate',
	async (msg: IDiscordMessage): Promise<void> => {
		const botWasMentioned = msg.mentions.find(
			(mentionedUser) => mentionedUser.id === bot.user.id
		);
		if (botWasMentioned) {
			try {
				const embedMessage = discordResultEmbed.help(msg);
				return bot.createMessage(String(msg.channel.id), {
					embed: embedMessage
				});
			} catch (err) {
				console.warn('Failed to respond to mention.');
				return console.warn(err);
			}
		}
		const channel =
			process.env.NODE_ENV === 'PRODUCTION' ? msg.channel : masterChannel;
		if (!msg.author.bot) {
			const embedMessage: IDiscordEmbed = await discordDispatcher.dispatch(
				bot,
				msg,
				channel
			);
			return bot.createMessage(String(channel.id), { embed: embedMessage });
		}
	}
);

bot.on('error', (err) => {
	console.warn(err);
});

bot.connect();

export const discordMain = {
	sendToMaster: function (msg: string): void {
		if (masterChannel) {
			masterChannel.createMessage(msg);
		}
	},
	sendToChannel: async function (channel: string = '', msg: string) {
		await bot.createMessage(channel, msg);
	},
	logger: function (req, res, next): void {
		if (process.env.NODE_ENV === 'PRODUCTION') {
			const msg =
				new Date().toLocaleString() +
				' ' +
				req.method +
				': ' +
				req.url +
				' params: ' +
				JSON.stringify(req.params) +
				' query: ' +
				JSON.stringify(req.query);
			discordMain.sendToMaster(msg);
		}
		next();
	}
};
