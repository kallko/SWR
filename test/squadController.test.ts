import { expect } from 'chai';
import { squadController } from '../server-src/controller/squadController';
import { squadService } from '../server-src/service/squadService';

describe('SquadController tests:', async function () {
	it('return rules for mod with 5 different heroes', async function () {
		this.timeout(20000);
		const result = await squadController.getModeRulesForArenaSquad(621723826);
		expect(result.length).equal(5);
		expect(result[0].hasOwnProperty('name')).equal(true);
		expect(result[0].hasOwnProperty('possibleSets')).equal(true);
		expect(result[0].hasOwnProperty('secondary')).equal(true);
	});
	it('Service test for order', async function () {
		this.timeout(20000);
		const result = await squadService.getBySquad(
			{
				squad:
					'SUPREMELEADERKYLOREN,FIRSTORDERTROOPER,FOSITHTROOPER,GENERALHUX,KYLORENUNMASKED'
			},
			621723826
		);
		expect(result[0].hasOwnProperty('id')).equal(true);
		expect(result[0].hasOwnProperty('squad')).equal(true);
		expect(result[0].hasOwnProperty('modeRules')).equal(true);
	});
});
