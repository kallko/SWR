import { discordDispatcher } from '../server-src/integration/discord/discordDispatcher';
import { expect } from 'chai';
const sinon = require('sinon');
import { IDiscordMessage } from '../server-src/@types/IDiscord';

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
	it.only('msg with content swr -gl should call guildList function', async function () {
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
		console.log('Result in tests ', result);
		// expect(result).equal(true);
		stub.restore();
	});
});
