import { expect } from 'chai';
import { modController } from '../server-src/controller/modController';
import { fetchDataService } from '../server-src/service/fetchDataService';
const sinon = require('sinon');

xdescribe('mod Controller tests:', async function () {
	beforeEach(function () {
		this.stubGetAllMods = sinon.spy(fetchDataService, 'getAllMods');
		this.stubGetPlayer = sinon.spy(fetchDataService, 'getPlayer');
	});
	afterEach(function () {
		this.stubGetAllMods.restore();
		this.stubGetPlayer.restore();
	});
	it('Should once call fetch get all mods', async function () {
		await modController.creator(621723826);
		expect(this.stubGetAllMods.callCount).equal(1);
	});
	it('Should once call fetch get player', async function () {
		await modController.creator(621723826);
		expect(this.stubGetPlayer.callCount).equal(1);
	});
	it('developer test', async function () {
		this.timeout(10000);
		const result = await modController.creator(621723826);
	});
});
