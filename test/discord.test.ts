import { expect } from 'chai';
import * as sinon from 'sinon';
import { IDiscordMessage } from '../server-src/@types/IDiscord';

import { discordDispatcher } from '../server-src/integration/discord/discordDispatcher';

import { fetchDataService } from '../server-src/service/fetchDataService';
import { userService } from '../server-src/service/UserService';
import { discordHelper } from '../server-src/integration/discord/discordHelper';
import { UnitService } from '../server-src/service/UnitService';
import { discordResultEmbed } from '../server-src/integration/discord/discordResultEmbed';
import { guildService } from '../server-src/service/guildService';
import { ideaService } from '../server-src/service/IdeaService';
import { modController } from '../server-src/controller/modController';

const MESSAGE: IDiscordMessage = {
	content: 'swr -h',
	author: {
		id: '590913433738936329',
		username: 'test',
		bot: false
	},
	addReaction(s: string) {}
};

const CHANNEL = {
	id: 100,
	type: 0,
	createMessage: (msg, channel) => {}
};

const BOT = null;

const sandbox = sinon.createSandbox();

describe('discordDispatcher tests:', async function () {
	this.timeout(500000);

	describe('Check for call correct function', () => {
		beforeEach(() => {
			if (process.env.NODE_ENV === 'TEST') {
				sandbox.stub(userService, 'getUserByDiscordId').callsFake(() => {
					return {
						id: 1,
						playerName: 'TestUser',
						allyCode: '1234567',
						rang: 0
					};
				});
				sandbox.stub(userService, 'getUser').callsFake(() => {
					return {
						id: 1,
						playerName: 'TestUser',
						allyCode: '1234567',
						rang: 0
					};
				});
				sandbox.stub(userService, 'update').callsFake(() => {
					return { playerName: 'NewTestName' };
				});
				sandbox.stub(guildService, 'updateGuildMember').callsFake(() => {
					return {};
				});
			}
		});
		afterEach(() => {
			sandbox.restore();
		});
		it('msg with content swr -h and correct discord id should call help function', async function () {
			sandbox.stub(discordDispatcher, 'help').callsFake(() => true);
			const message: IDiscordMessage = MESSAGE;
			const result: any = await discordDispatcher.dispatch(
				BOT,
				message,
				CHANNEL
			);
			expect(result).equal(true);
		});
		it('msg with content swr -h and not correct discord id should call help function', async function () {
			sandbox.stub(discordDispatcher, 'help').callsFake(() => true);
			const message: IDiscordMessage = MESSAGE;
			message.author.id = '5909134';
			const result: any = await discordDispatcher.dispatch(
				BOT,
				message,
				CHANNEL
			);
			expect(result).equal(true);
		});
		it('msg with content swr -mcu should call colorUp function', async function () {
			sandbox.stub(discordDispatcher, 'colorUp').callsFake(() => true);
			const message: IDiscordMessage = MESSAGE;
			message.content = 'swr -mcu';
			const result: any = await discordDispatcher.dispatch(
				BOT,
				message,
				CHANNEL
			);
			expect(result).equal(true);
		});
		it('msg with content swr -lp should call legend progress function', async function () {
			sandbox.stub(discordDispatcher, 'legendProgress').callsFake(() => true);
			const message: IDiscordMessage = MESSAGE;
			message.content = 'swr -lp';
			const result: any = await discordDispatcher.dispatch(
				BOT,
				message,
				CHANNEL
			);
			expect(result).equal(true);
		});
		it('msg with content swr -gl should call guildList function', async function () {
			sandbox.stub(discordDispatcher, 'guildList').callsFake(() => true);
			const message: IDiscordMessage = MESSAGE;
			message.content = 'swr -gl';
			const result: any = await discordDispatcher.dispatch(
				BOT,
				message,
				CHANNEL
			);
			expect(result).equal(true);
		});
		it('msg with content swr -mba should call colorUp function', async function () {
			sandbox.stub(discordDispatcher, 'arenaMods').callsFake(() => true);
			const message: IDiscordMessage = MESSAGE;
			message.content = 'swr -mba';
			const result: any = await discordDispatcher.dispatch(
				BOT,
				message,
				CHANNEL
			);
			expect(result).equal(true);
		});
	});

	describe('Check registration options', async () => {
		beforeEach(() => {
			if (process.env.NODE_ENV === 'TEST') {
				sandbox.stub(userService, 'getUserByDiscordId').callsFake(() => {
					return {
						id: 1,
						playerName: 'TestUser',
						allyCode: '1234567',
						rang: 0
					};
				});
				sandbox.stub(guildService, 'updateGuildMember').callsFake(() => {
					return {};
				});
			}
		});
		afterEach(() => {
			sandbox.restore();
		});
		it("shouldn't register a user with wrong allyCode", async function () {
			const spy = sandbox.spy(fetchDataService, 'getPlayer');
			sandbox.stub(discordResultEmbed, 'registered').callsFake(() => true);
			const message: IDiscordMessage = MESSAGE;
			message.content = 'swr -r 12312';
			await discordDispatcher.dispatch(BOT, message, CHANNEL);
			expect(spy.callCount).equal(0);
			spy.restore();
		});
		it('should register a user with new allyCode and new discordCode', async function () {
			const createUser = sandbox
				.stub(userService, 'createUser')
				.callsFake(() => true);
			sandbox.stub(fetchDataService, 'getPlayer').callsFake(() => {
				return {
					data: {
						name: 'testName'
					}
				};
			});
			sandbox.stub(userService, 'getUser').callsFake(() => {
				return null;
			});
			const message: IDiscordMessage = MESSAGE;
			message.content = 'swr -r 111111111';
			await discordDispatcher.dispatch(BOT, message, CHANNEL);
			expect(createUser.callCount).equal(1);
			createUser.restore();
		});
		it('should not register a user with wrong allyCode', async function () {
			const stubCreate = sinon
				.stub(userService, 'createUser')
				.callsFake(() => true);
			sandbox.stub(userService, 'getUser').callsFake(() => {
				return {
					id: 1,
					playerName: 'TestUser',
					allyCode: '1234567',
					rang: 0
				};
			});
			const message: IDiscordMessage = MESSAGE;
			message.content = 'swr -r 111111111';
			await discordDispatcher.dispatch(BOT, message, CHANNEL);
			expect(stubCreate.callCount).equal(0);
			stubCreate.restore();
		});
		it('should update a user with wrong existing discord code', async function () {
			const stubCreate = sinon
				.stub(userService, 'createUser')
				.callsFake(() => true);
			const userServiceStubUpdate = sinon
				.stub(userService, 'update')
				.callsFake(() => true);
			sandbox.stub(userService, 'getUser').callsFake(() => {
				return {
					id: 1,
					playerName: 'TestUser',
					allyCode: '1234567',
					rang: 0
				};
			});
			const message: IDiscordMessage = MESSAGE;
			message.content = 'swr -r 621723826';
			message.author.id = '590913433738936329546';
			await discordDispatcher.dispatch(BOT, message, CHANNEL);
			expect(stubCreate.callCount).equal(0);
			expect(userServiceStubUpdate.callCount).equal(1);
			stubCreate.restore();
			userServiceStubUpdate.restore();
		});
		it('should return help with wrong options', async function () {
			const helpFunction = sinon
				.stub(discordDispatcher, 'help')
				.callsFake(() => true);
			const message: IDiscordMessage = MESSAGE;
			message.content = 'swr -gth';
			await discordDispatcher.dispatch(BOT, message, CHANNEL);
			expect(helpFunction.callCount).equal(1);
		});
	});

	describe('guild top list:', async function () {
		let spyGetGuildTop,
			UnitServiceGetGuildTopByField,
			discordResultEmbedGuildTop;

		beforeEach(function () {
			if (process.env.NODE_ENV === 'TEST') {
				sandbox.stub(userService, 'getUserByDiscordId').callsFake(() => {
					return {
						id: 1,
						playerName: 'TestUser',
						allyCode: '1234567',
						rang: 0
					};
				});
				sandbox.stub(userService, 'getUser').callsFake(() => {
					return {
						id: 1,
						playerName: 'TestUser',
						allyCode: '1234567',
						rang: 0
					};
				});
				sandbox.stub(userService, 'update').callsFake(() => {
					return { playerName: 'NewTestName' };
				});
				sandbox.stub(guildService, 'updateGuildMember').callsFake(() => {
					return {};
				});
				UnitServiceGetGuildTopByField = sinon
					.stub(UnitService, 'getGuildTopByField')
					.callsFake(() => true);
				discordResultEmbedGuildTop = sinon
					.stub(discordResultEmbed, 'guildTop')
					.callsFake(() => true);
				spyGetGuildTop = sinon.spy(discordDispatcher, 'guildTop');
				sandbox.stub(guildService, 'getGuildId').callsFake(() => 1);
				sandbox.stub(guildService, 'getGuildName').callsFake(() => '1');
				sandbox.stub(guildService, 'getGuildMembers').callsFake(() => true);
			}
		});
		afterEach(function () {
			spyGetGuildTop.restore();
			UnitServiceGetGuildTopByField.restore();
			discordResultEmbedGuildTop.restore();
			sandbox.restore();
		});
		it('should return units with top-speed for guild', async function () {
			const message: IDiscordMessage = MESSAGE;
			message.content = 'swr -gtu -rank=speed';
			await discordDispatcher.dispatch(BOT, message, CHANNEL);
			expect(UnitServiceGetGuildTopByField.callCount).equal(1);
			expect(discordResultEmbedGuildTop.callCount).equal(1);
			UnitServiceGetGuildTopByField.restore();
			discordResultEmbedGuildTop.restore();
		});
		it('should return units with top-power for guild', async function () {
			const message: IDiscordMessage = MESSAGE;
			message.content = 'swr -gtu -rank=power';
			await discordDispatcher.dispatch(null, message, CHANNEL);
			expect(UnitServiceGetGuildTopByField.callCount).equal(1);
			expect(discordResultEmbedGuildTop.callCount).equal(1);
		});
		it('should return units with top-health for guild', async function () {
			const message: IDiscordMessage = MESSAGE;
			message.content = 'swr -gtu -rank=health';
			await discordDispatcher.dispatch(null, message, CHANNEL);
			expect(UnitServiceGetGuildTopByField.callCount).equal(1);
			expect(discordResultEmbedGuildTop.callCount).equal(1);
		});
		it('should return units with top-defense for guild', async function () {
			const message: IDiscordMessage = MESSAGE;
			message.content = 'swr -gtu -rank=defense';
			await discordDispatcher.dispatch(BOT, message, CHANNEL);
			expect(spyGetGuildTop.callCount).equal(1);
			expect(UnitServiceGetGuildTopByField.callCount).equal(1);
			expect(discordResultEmbedGuildTop.callCount).equal(1);
		});
		it('should return units with top-damage for guild', async function () {
			const message: IDiscordMessage = MESSAGE;
			message.content = 'swr -gtu -rank=damage';
			await discordDispatcher.dispatch(BOT, message, CHANNEL);
			expect(spyGetGuildTop.callCount).equal(1);
			expect(UnitServiceGetGuildTopByField.callCount).equal(1);
			expect(discordResultEmbedGuildTop.callCount).equal(1);
		});
		it('should return units with top-potency for guild', async function () {
			const message: IDiscordMessage = MESSAGE;
			message.content = 'swr -gtu -rank=potency';
			await discordDispatcher.dispatch(BOT, message, CHANNEL);
			expect(spyGetGuildTop.callCount).equal(1);
			expect(UnitServiceGetGuildTopByField.callCount).equal(1);
			expect(discordResultEmbedGuildTop.callCount).equal(1);
		});
		it('should return units with top-tenacity for guild', async function () {
			const message: IDiscordMessage = MESSAGE;
			message.content = 'swr -gtu -rank=tenacity';
			await discordDispatcher.dispatch(BOT, message, CHANNEL);
			expect(spyGetGuildTop.callCount).equal(1);
			expect(UnitServiceGetGuildTopByField.callCount).equal(1);
			expect(discordResultEmbedGuildTop.callCount).equal(1);
		});
		it('should return units with top-protection for guild', async function () {
			const message: IDiscordMessage = MESSAGE;
			message.content = 'swr -gtu -rank=protection';
			await discordDispatcher.dispatch(BOT, message, CHANNEL);
			expect(spyGetGuildTop.callCount).equal(1);
			expect(UnitServiceGetGuildTopByField.callCount).equal(1);
			expect(discordResultEmbedGuildTop.callCount).equal(1);
		});
		it('should not return results for wrong rank for guild', async function () {
			const message: IDiscordMessage = MESSAGE;
			message.content = 'swr -gtu -rank=blablabla';
			await discordDispatcher.dispatch(BOT, message, CHANNEL);
			expect(spyGetGuildTop.callCount).equal(1);
			expect(UnitServiceGetGuildTopByField.callCount).equal(0);
			expect(discordResultEmbedGuildTop.callCount).equal(0);
		});
	});
	describe('String option parser', () => {
		it('should parse string with option', async function () {
			const result = discordHelper.getParameters('-gtu -rank=health ', '-gtu');
			expect(result).deep.equal({ rank: 'health' });
		});
		it('should parse string with several options', async function () {
			const result = discordHelper.getParameters(
				'-gtu -rank=health -sort=desc',
				'-gtu'
			);
			expect(result).deep.equal({ rank: 'health', sort: 'desc' });
		});
	});
	describe('Idea creator', () => {
		beforeEach(function () {
			if (process.env.NODE_ENV === 'TEST') {
				sandbox.stub(userService, 'getUserByDiscordId').callsFake(() => {
					return {
						id: 1,
						playerName: 'TestUser',
						allyCode: '1234567',
						rang: 0
					};
				});
				sandbox.stub(userService, 'getUser').callsFake(() => {
					return {
						id: 1,
						playerName: 'TestUser',
						allyCode: '1234567',
						rang: 0
					};
				});
				sandbox.stub(userService, 'update').callsFake(() => {
					return { playerName: 'NewTestName' };
				});
				sandbox.stub(guildService, 'updateGuildMember').callsFake(() => {
					return {};
				});
			}
		});
		afterEach(function () {
			sandbox.restore();
		});
		it('should create idea in db', async function () {
			const ideaSpy = sinon.stub(ideaService, 'create').callsFake(() => true);
			const message: IDiscordMessage = MESSAGE;
			message.content = 'swr -i hi, I am idea';
			await discordDispatcher.dispatch(BOT, message, CHANNEL);
			expect(ideaSpy.callCount).equal(1);
			ideaSpy.restore();
		});
	});
	describe('Mod Units evaluator', () => {
		beforeEach(function () {
			if (process.env.NODE_ENV === 'TEST') {
				sandbox.stub(userService, 'getUserByDiscordId').callsFake(() => {
					return {
						id: 1,
						playerName: 'TestUser',
						allyCode: '1234567',
						rang: 0
					};
				});
				sandbox.stub(userService, 'getUser').callsFake(() => {
					return {
						id: 1,
						playerName: 'TestUser',
						allyCode: '1234567',
						rang: 0
					};
				});
				sandbox.stub(userService, 'update').callsFake(() => {
					return { playerName: 'NewTestName' };
				});
				sandbox.stub(guildService, 'updateGuildMember').callsFake(() => {
					return {};
				});
			}
		});
		afterEach(function () {
			sandbox.restore();
		});
		it('Looking for evaluation mods from Padme Amidala', async function () {
			const controllerSpy = sinon
				.stub(modController, 'getModForEvolution')
				.callsFake(() => true);
			const message: IDiscordMessage = MESSAGE;
			message.content = 'swr -mue -unit=PADMEAMIDALA';
			await discordDispatcher.dispatch(BOT, message, CHANNEL);
			expect(controllerSpy.callCount).equal(1);
			controllerSpy.restore();
		});
	});
});
