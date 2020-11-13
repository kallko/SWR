import { expect } from 'chai';
import { squadController } from '../server-src/controller/squadController';
import { squadService } from '../server-src/service/squadService';

xdescribe('SquadController tests:', async function () {
	xit('return rules for mod with 5 different heroes', async function () {
		this.timeout(20000);
		const result = await squadController.getModeRulesForArenaSquad(621723826);
		result.forEach((hero) => console.log(hero.arrow));
		if (result.some((hero) => hero.arrow.include('Health'))) {
			console.log(
				'!!! ARROW ',
				result.filter((hero) => hero.arrow === 'Health')
			);
		}
		expect(result.length).equal(5);
		expect(result[0].hasOwnProperty('name')).equal(true);
		expect(result[0].hasOwnProperty('possibleSets')).equal(true);
		expect(result[0].hasOwnProperty('secondary')).equal(true);
	});
	it.only('Service test for order', async function () {
		this.timeout(20000);
		const result = await squadService.getBySquad(
			{
				squad:
					'SUPREMELEADERKYLOREN,FIRSTORDERTROOPER,FOSITHTROOPER,GENERALHUX,KYLORENUNMASKED'
			},
			621723826
		);
		console.log('Result ', result);
	});
});
