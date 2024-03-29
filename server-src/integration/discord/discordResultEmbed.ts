import { IGuild, ILegendProgress } from '../../@types/IGuild';
import { MOD_OPTIONS } from '../../@const/modOptions';
import { IIdeaCreationAttributes, Unit } from '../../service/dbModels';
import { TopFieldList } from '../../@types/IUnit';
import { IDiscordEmbed, IDiscordMessage } from '../../@types/IDiscord';
import { discordConfig } from './discordConfig';
import * as moment from 'moment';
import {
	stringifyBestMods,
	getNameWithSecondary,
	getModRules,
	getModForms
} from '../../helper/modHelper';
import { IModEvaluation } from '../../@types/IMod';
const version = process.env.npm_package_version;

const footer = {
	text: `Support SWR Bot on patreon: https://www.patreon.com/kalko`
};
const author = {
	name: `SWR Bot v${version}`
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
			color: '16735873',
			fields: [],
			footer
		};
	},
	noParameter(msg: IDiscordMessage) {
		return {
			title: msg.author.username,
			description: ` Input parameter pls, for example: \n swr -gtu -rank=speed \n (Possible ranks: health, speed, power, damage, defense, potency, tenacity, protection)`,
			author,
			color: '16735873',
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
				'Your guild: ' +
				(msg.author.guildName || 'will be add in next version'),
			author,
			color: '16768350',
			fields: [
				{
					name: '1',
					value: value0 || 'no data',
					inline: false
				},
				{
					name: '2',
					value: value1 || 'no data',
					inline: false
				},
				{
					name: '3',
					value: value2 || 'no data',
					inline: false
				},
				{
					name: '4',
					value: value3 || 'no data',
					inline: false
				},
				{
					name: '5',
					value: value4 || 'no data',
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
					value: value || 'no data',
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
						result[0].display_data.last_week_add +
						(result[0].display_data.estimated_date
							? '\n' +
							  'Receiving: ' +
							  transformEstimatedDate(result[0].display_data.estimated_date)
							: ''),
					inline: false
				},
				{
					name: 'Rey Progress',
					value:
						result[1].display_data.display_status +
						'\n' +
						'From last week: ' +
						result[1].display_data.last_week_add +
						(result[1].display_data.estimated_date
							? '\n' +
							  'Receiving: ' +
							  transformEstimatedDate(result[1].display_data.estimated_date)
							: ''),
					inline: true
				},
				{
					name: 'Palpatin Progress',
					value:
						result[2].display_data.display_status +
						'\n' +
						'From last week: ' +
						result[2].display_data.last_week_add +
						(result[2].display_data.estimated_date
							? '\n' +
							  'Receiving: ' +
							  transformEstimatedDate(result[2].display_data.estimated_date)
							: ''),
					inline: false
				},
				{
					name: 'Luke Progress',
					value:
						result[3].display_data.display_status +
						'\n' +
						'From last week: ' +
						result[3].display_data.last_week_add +
						(result[3].display_data.estimated_date
							? '\n' +
							  'Receiving: ' +
							  transformEstimatedDate(result[3].display_data.estimated_date)
							: ''),
					inline: true
				},
				{
					name: 'Kenobi Progress',
					value:
						result[4].display_data.display_status +
						'\n' +
						'From last week: ' +
						result[4].display_data.last_week_add +
						(result[4].display_data.estimated_date
							? '\n' +
							  'Receiving: ' +
							  transformEstimatedDate(result[4].display_data.estimated_date)
							: ''),
					inline: false
				},
				{
					name: 'Vader Progress',
					value:
						result[5].display_data.display_status +
						'\n' +
						'From last week: ' +
						result[5].display_data.last_week_add +
						(result[5].display_data.estimated_date
							? '\n' +
							  'Receiving: ' +
							  transformEstimatedDate(result[4].display_data.estimated_date)
							: ''),
					inline: false
				}
			],
			footer
		};
	},
	colorUpMods(mods, msg: IDiscordMessage): IDiscordEmbed {
		// todo make color green for all the best;
		const mods5 = mods.filter((mod) => mod.rarity === 5);
		const value5 =
			mods5.length === 0
				? 'You made your best. Nothing to upgrade.'
				: mods5.reduce(
						(sum, entry) =>
							entry.character + ' - ' + MOD_OPTIONS.form[entry.slot] + '\n',
						''
				  );
		let value6 =
			mods.length === 0
				? 'You made your best. Nothing to upgrade.'
				: mods.reduce(
						(sum, entry) =>
							entry.rarity === 6
								? sum +
								  entry.character +
								  ' - ' +
								  MOD_OPTIONS.form[entry.slot] +
								  '\n'
								: '',
						''
				  );
		value6 = validateColorUpModsStringLength(value6);
		return {
			title: msg.author.greeting || msg.author.username,
			description: 'These mods after upgrade could add more than 25 speed:',
			author,
			color: '16768350',
			fields: [
				{
					name: 'Mods 6*:',
					value: value6 || 'You made your best. Nothing to upgrade.',
					inline: false
				},
				{
					name: 'Mods 5*:',
					value: value5 || 'You made your best. Nothing to upgrade.',
					inline: false
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
	},
	arenaMods(result, msg: IDiscordMessage): IDiscordEmbed {
		// todo make color green for all the best;
		return {
			title: msg.author.greeting || msg.author.username,
			description: 'For Your Arena team',
			author,
			color: '16768350',
			fields: [
				{
					name: 'Mod Set Options:',
					value: getModRules(result.squadOptions),
					inline: false
				},
				{
					name: getNameWithSecondary(result.newSets[0]?.hero),
					value: stringifyBestMods(result.newSets[0], result.existingMods),
					inline: false
				},
				{
					name: getNameWithSecondary(result.newSets[1]?.hero),
					value: stringifyBestMods(result.newSets[1], result.existingMods),
					inline: false
				},
				{
					name: getNameWithSecondary(result.newSets[2]?.hero),
					value: stringifyBestMods(result.newSets[2], result.existingMods),
					inline: false
				},
				{
					name: getNameWithSecondary(result.newSets[3]?.hero),
					value: stringifyBestMods(result.newSets[3], result.existingMods),
					inline: false
				},
				{
					name: getNameWithSecondary(result.newSets[4]?.hero),
					value: stringifyBestMods(result.newSets[4], result.existingMods),
					inline: false
				}
			],
			footer
		};
	},
	modEvolution(
		modsForEvolution: IModEvaluation[],
		msg: IDiscordMessage,
		baseId
	) {
		const description =
			modsForEvolution.length > 0
				? 'For ' + baseId + ', i will recommend to upgrade these mods:'
				: 'For ' + baseId + ' all mods looks good.';
		const modForms = getModForms();
		const color = modsForEvolution.length > 0 ? '6225884' : '16768350';
		const fields =
			modsForEvolution.length === 0
				? []
				: modsForEvolution.map((set) => {
						const value = set.children.reduce(
							(sum, mod) =>
								sum +
								mod.character +
								' (possible speed: ' +
								mod.expectedSpeed +
								')' +
								'\n',
							''
						);
						return {
							name: modForms[set.parent.slot - 1].toString(),
							value,
							inline: false
						};
				  });
		fields.push({
			name: 'additional tips:',
			value:
				'You could use: \n swr -mue -unit=3 (advice about third by power unit mods)\n swr -mue -unit=KYLOREN\n swr -mue by default give advice about most powerful unit, which could be upgraded',
			inline: false
		});
		return {
			title: msg.author.greeting || msg.author.username,
			description,
			author,
			color,
			fields,
			footer
		};
	},
	error(error, msg: IDiscordMessage): IDiscordEmbed {
		return {
			title: msg.author.greeting || msg.author.username,
			description: 'Something goes wrong',
			author,
			color: '16735873',
			fields: [
				{
					name: 'Description:',
					value: error.toString(),
					inline: true
				}
			],
			footer
		};
	}
};

function transformEstimatedDate(date: Date): string {
	let result = moment(date).format('DD:MM:YYYY');
	if (moment(date).isSame('1970-01-01') || moment(date).isBefore(moment())) {
		result = 'Maybe never';
	}
	if (moment(date).isSame('1980-01-01')) {
		result = 'Not enough data';
	}
	if (moment(date).isSame('1990-01-01')) {
		result = 'Not enough data, try in a week';
	}
	return result;
}

function validateColorUpModsStringLength(valueString: string): string {
	const maxStringLength = 1024;
	if (valueString.length < maxStringLength) {
		return valueString;
	}
	const parts = valueString.split('\n');
	let newValueString = '';
	let index = parts.length - 1;
	for (const part of parts) {
		if (newValueString.length + part.length < maxStringLength - 10) {
			newValueString += `${part}\n`;
		} else {
			newValueString += `and ${index}  more...`;
			break;
		}
		index--;
	}
	return newValueString;
}
