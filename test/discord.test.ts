import { expect } from 'chai';
const sinon = require('sinon');

import { IDiscordMessage } from '../server-src/@types/IDiscord';

import { discordDispatcher } from '../server-src/integration/discord/discordDispatcher';

import { fetchDataService } from '../server-src/service/fetchDataService';
import { userService } from '../server-src/service/UserService';

describe('discordDispatcher tests:', async function () {
	this.timeout(500000);
	it('msg with content swr -h should call help function', async function () {
		const stub = sinon.stub(discordDispatcher, 'help').callsFake(() => true);
		const message: IDiscordMessage = { content: 'swr -h' };
		let result: any = await discordDispatcher.dispatch(message, {
			id: 100,
			type: 0
		});
		expect(result).equal(true);
		stub.restore();
	});
	it('msg with content swr -h should call help function', async function () {
		const stub = sinon.stub(discordDispatcher, 'help').callsFake(() => true);
		const message: IDiscordMessage = { content: 'swr -h' };
		let result: any = await discordDispatcher.dispatch(message, {
			id: 100,
			type: 0
		});
		expect(result).equal(true);
		stub.restore();
	});
	it('msg with content swr -cu should call colorUp function', async function () {
		const stub = sinon.stub(discordDispatcher, 'colorUp').callsFake(() => true);
		const message: IDiscordMessage = { content: 'swr -cu' };
		let result: any = await discordDispatcher.dispatch(message, {
			id: 100,
			type: 0
		});
		expect(result).equal(true);
		stub.restore();
	});
	it('msg with content swr -lp should call legend progress function', async function () {
		const stub = sinon
			.stub(discordDispatcher, 'legendProgress')
			.callsFake(() => true);
		const message: IDiscordMessage = { content: 'swr -lp' };
		let result: any = await discordDispatcher.dispatch(message, {
			id: 100,
			type: 0
		});
		expect(result).equal(true);
		stub.restore();
	});
	it('msg with content swr -gl should call guildList function', async function () {
		const stub = sinon
			.stub(discordDispatcher, 'guildList')
			.callsFake(() => true);
		const message: IDiscordMessage = {
			content: 'swr -gl',
			author: {
				id: '590913433738936329',
				username: 'triton',
				bot: false
			}
		};
		let result: any = await discordDispatcher.dispatch(message, {
			id: 100,
			type: 0
		});
		expect(result).equal(true);
		stub.restore();
	});
	it("shouldn't register a user with wrong allyCode", async function () {
		const spy = sinon.spy(fetchDataService, 'getPlayer');
		const message: IDiscordMessage = {
			content: 'swr -r 12312',
			author: {
				id: '590913433738936329',
				username: 'triton',
				bot: false
			}
		};
		await discordDispatcher.dispatch(message, {
			createMessage: (msg, channel) => {},
			id: 100,
			type: 0
		});
		expect(spy.callCount).equal(0);
		spy.restore();
	});
	it('should register a user with new allyCode and new discordCode', async function () {
		const stubCreate = sinon
			.stub(userService, 'createUser')
			.callsFake(() => true);
		const stubFetch = sinon
			.stub(fetchDataService, 'getPlayer')
			.callsFake(() => {
				return {
					data: {
						name: 'testName'
					}
				};
			});
		const message: IDiscordMessage = {
			content: 'swr -r 111111111',
			author: {
				id: '111',
				username: 'Test',
				bot: false
			}
		};
		await discordDispatcher.dispatch(message, {
			createMessage: (msg, channel) => {},
			id: 100,
			type: 0
		});
		expect(stubCreate.callCount).equal(1);
		stubCreate.restore();
		stubFetch.restore();
	});
	it('should not register a user with wrong allyCode', async function () {
		const stubCreate = sinon
			.stub(userService, 'createUser')
			.callsFake(() => true);
		const message: IDiscordMessage = {
			content: 'swr -r 111111111',
			author: {
				id: '111',
				username: 'Test',
				bot: false
			}
		};
		await discordDispatcher.dispatch(message, {
			createMessage: (msg, channel) => {},
			id: 100,
			type: 0
		});
		expect(stubCreate.callCount).equal(0);
		stubCreate.restore();
	});
	it('should update a user with wrong existing discord code', async function () {
		const stubCreate = sinon
			.stub(userService, 'createUser')
			.callsFake(() => true);
		const stubUpdate = sinon.stub(userService, 'update').callsFake(() => true);
		const message: IDiscordMessage = {
			content: 'swr -r 621723826',
			author: {
				id: '590913433738936329',
				username: 'Test',
				bot: false
			}
		};
		await discordDispatcher.dispatch(message, {
			createMessage: (msg, channel) => {},
			id: 100,
			type: 0
		});
		expect(stubCreate.callCount).equal(0);
		expect(stubUpdate.callCount).equal(1);
		stubCreate.restore();
	});
});
