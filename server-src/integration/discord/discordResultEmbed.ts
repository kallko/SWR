import { IGuild, ILegendProgress } from '../../@types/IGuild';
import { MOD_OPTIONS } from '../../@const/modOptions';
import { IIdeaCreationAttributes, Unit } from '../../service/dbModels';
import { TopFieldList } from '../../@types/IUnit';
import { IDiscordEmbed, IDiscordMessage } from '../../@types/IDiscord';
import { discordConfig } from './discordConfig';
const footer = {
	text: `Support SWR Bot on patreon: https://www.patreon.com/kalko`
};
const author = {
	name: `SWR Bot`
};

export const discordResultEmbed = {
	notRegistered(msg: IDiscordMessage, description?: string) {
		return {
			title: msg.author.username,
			description:
				description ||
				'You are not registered yet. ' +
					'\n To register, type command swr -r xxxxxxxxx ' +
					'\n Where xxxxxxxxx is Your ally-code ' +
					'\n You should be registered on swogh.gg',
			author,
			color: '16711735',
			fields: [],
			footer
		};
	},
	registered(title: string, allyCode: number) {
		return {
			title,
			description: 'You have been registered',
			author,
			color: '16768350',
			fields: [
				{
					name: 'Profile',
					value: `https://swgoh.gg/p/${allyCode}/`,
					inline: false
				}
			],
			footer
		};
	},
	help(msg: IDiscordMessage) {
		return {
			author,
			color: '16768350',
			title: msg.author.greeting || msg.author.username,
			description: `All commands should start with: swr and then some key, like -lp and then options
			\n For example:
			\n swr -r 111111111
			\n swr -lp
			\n swr -gtu -rank=speed
			\n List of possible commands and options:`,
			fields: [
				{
					name: `--General--`,
					value: discordConfig
						.filter((option) => option.id < 10)
						.reduce(
							(val, option) => val + `${option.key} ${option.description}\n`,
							''
						),
					inline: true
				},
				{
					name: `--Player--`,
					value: discordConfig
						.filter((option) => option.id > 9 && option.id < 100)
						.reduce(
							(val, option) => val + `${option.key} ${option.description}\n`,
							''
						),
					inline: true
				},
				{
					name: `--Guild--`,
					value: discordConfig
						.filter((option) => option.id >= 100)
						.reduce(
							(val, option) => val + `${option.key} ${option.description}\n`,
							''
						),
					inline: true
				}
			],
			footer
		};
	},
	guildList(guild: IGuild, msg: IDiscordMessage): IDiscordEmbed {
		const value0 = guild.members
			.filter((member, id) => id < 10)
			.reduce(
				(sum, member, index) =>
					(sum += index + 1 + '.  ' + member.name + '\t' + member.id + '\n'),
				''
			);
		const value1 = guild.members
			.filter((member, id) => id >= 10 && id < 20)
			.reduce(
				(sum, member, index) =>
					(sum += index + 11 + '.  ' + member.name + '\t' + member.id + '\n'),
				''
			);
		const value2 = guild.members
			.filter((member, id) => id >= 20 && id < 30)
			.reduce(
				(sum, member, index) =>
					(sum += index + 21 + '.  ' + member.name + '\t' + member.id + '\n'),
				''
			);
		const value3 = guild.members
			.filter((member, id) => id >= 30 && id < 40)
			.reduce(
				(sum, member, index) =>
					(sum += index + 31 + '.  ' + member.name + '\t' + member.id + '\n'),
				''
			);
		const value4 = guild.members
			.filter((member, id) => id >= 40)
			.reduce(
				(sum, member, index) =>
					(sum += index + 41 + '.  ' + member.name + '\t' + member.id + '\n'),
				''
			);

		return {
			title: msg.author.greeting,
			description:
				'Your guild ' + msg.author.guildName || 'will be add in next version',
			author,
			color: '16768350',
			fields: [
				{
					name: '1',
					value: value0,
					inline: false
				},
				{
					name: '2',
					value: value1,
					inline: false
				},
				{
					name: '3',
					value: value2,
					inline: false
				},
				{
					name: '4',
					value: value3,
					inline: false
				},
				{
					name: '5',
					value: value4,
					inline: false
				}
			],
			footer
		};
	},
	guildTop(
		units: Unit[],
		rank: TopFieldList,
		msg: IDiscordMessage
	): IDiscordEmbed {
		const value = units.reduce(
			(sum, unit, index) =>
				(sum +=
					index +
					1 +
					'.  ' +
					unit.playerName +
					' ' +
					unit.name +
					' = ' +
					unit[rank] +
					'\n'),
			''
		);
		return {
			title: msg.author.greeting,
			description: 'There are top units of Your guild',
			author,
			color: '16768350',
			fields: [
				{
					name: rank.toString().toUpperCase() + ':',
					value,
					inline: false
				}
			],
			footer
		};
	},
	legendProgress(
		result: ILegendProgress[],
		msg: IDiscordMessage
	): IDiscordEmbed {
		return {
			title: msg.author.greeting,
			description: 'There is your progress for Legends',
			author,
			color: '16768350',
			fields: [
				{
					name: 'Kylo Progress',
					value:
						result[0].display_data.display_status +
						'\n' +
						'From last week: ' +
						result[0].display_data.last_week_add,
					inline: true
				},
				{
					name: 'Rey Progress',
					value:
						result[1].display_data.display_status +
						'\n' +
						'From last week: ' +
						result[1].display_data.last_week_add,
					inline: true
				}
			],
			footer
		};
	},
	colorUpMods(result, msg: IDiscordMessage): IDiscordEmbed {
		let description;
		const value =
			result.length === 0
				? 'You made your best. Nothing to upgrade.'
				: result.reduce(
						(sum, entry) =>
							sum +
							entry.character +
							' - ' +
							MOD_OPTIONS.form[entry.slot] +
							'\n',
						''
				  );
		return {
			title: msg.author.greeting || msg.author.username,
			description:
				description || 'These mods after upgrade could add more than 20 speed:',
			author,
			color: '16768350',
			fields: [
				{
					name: 'Mods:',
					value: value,
					inline: true
				}
			],
			footer
		};
	},
	ideaCreated: function (
		isCreated: boolean,
		msg: IDiscordMessage,
		idea: IIdeaCreationAttributes
	) {
		const description = isCreated
			? `thank You for Idea. We have already ${
					idea.id + 1
			  } ideas from our users.`
			: `${msg.author.greeting} thank You for Idea, but description is to short. Please, give to us more context`;
		return {
			title: msg.author.greeting || msg.author.username,
			description,
			author,
			color: '16768350',
			fields: [
				{
					name: 'Idea:',
					value: idea.text,
					inline: false
				}
			],
			footer
		};
	}
};
