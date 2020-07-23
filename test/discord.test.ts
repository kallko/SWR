import { expect } from 'chai';
const sinon = require('sinon');

import { IDiscordMessage } from '../server-src/@types/IDiscord';

import { discordDispatcher } from '../server-src/integration/discord/discordDispatcher';

import { fetchDataService } from '../server-src/service/fetchDataService';
import { userService } from '../server-src/service/UserService';
import { discordHelper } from '../server-src/integration/discord/discordHelper';
import { UnitService } from '../server-src/service/UnitService';
import { discordResultStringifier } from '../server-src/integration/discord/discordResultStringifier';

describe('discordDispatcher tests:', async function () {
	this.timeout(500000);
	it('msg with content swr -h and correct discord id should call help function', async function () {
		const stub = sinon.stub(discordDispatcher, 'help').callsFake(() => true);
		const message: IDiscordMessage = {
			content: 'swr -h',
			author: {
				id: '590913433738936329',
				username: 'test',
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
	it('msg with content swr -h and not correct discord id should call help function', async function () {
		const stub = sinon.stub(discordDispatcher, 'help').callsFake(() => true);
		const message: IDiscordMessage = {
			content: 'swr -h',
			author: {
				id: '59091343373893632',
				username: 'test',
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
	it('msg with content swr -cu should call colorUp function', async function () {
		const stub = sinon.stub(discordDispatcher, 'colorUp').callsFake(() => true);
		const message: IDiscordMessage = {
			content: 'swr -cu',
			author: {
				id: '590913433738936329',
				username: 'test',
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
	it('msg with content swr -lp should call legend progress function', async function () {
		const stub = sinon
			.stub(discordDispatcher, 'legendProgress')
			.callsFake(() => true);
		const message: IDiscordMessage = {
			content: 'swr -lp',
			author: {
				id: '590913433738936329',
				username: 'test',
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
			},
			channel: {
				type: 1
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
	it('should update a user with wrong existing discord code', async function () {
		const message: IDiscordMessage = {
			content: 'swr -gth',
			author: {
				id: '590913433738936329',
				username: 'Test',
				bot: false
			},
			channel: {
				type: 1
			}
		};
		await discordDispatcher.dispatch(message, {
			createMessage: (msg, channel) => {},
			id: 100,
			type: 0
		});
	});
	describe('guild top list:', async function () {
		let spyGetGuildTop, spyGetGuildTopByField, spyStringGuildTop;
		beforeEach(function () {
			spyGetGuildTop = sinon.spy(discordDispatcher, 'guildTop');
			spyGetGuildTopByField = sinon.spy(UnitService, 'getGuildTopByField');
			spyStringGuildTop = sinon.spy(discordResultStringifier, 'guildTop');
		});
		afterEach(function () {
			spyGetGuildTop.restore();
			spyGetGuildTopByField.restore();
			spyStringGuildTop.restore();
		});
		it('should return units with top-speed for guild', async function () {
			const message: IDiscordMessage = {
				content: 'swr -gtu -rank=speed',
				author: {
					id: '590913433738936329',
					username: 'Test',
					bot: false
				},
				channel: {
					type: 1
				}
			};
			await discordDispatcher.dispatch(message, {
				createMessage: (msg, channel) => {},
				id: 100,
				type: 0
			});
			expect(spyGetGuildTop.callCount).equal(1);
			expect(spyGetGuildTopByField.callCount).equal(1);
			expect(spyStringGuildTop.callCount).equal(1);
		});
		it('should return units with top-power for guild', async function () {
			const message: IDiscordMessage = {
				content: 'swr -gtu -rank=power',
				author: {
					id: '590913433738936329',
					username: 'Test',
					bot: false
				},
				channel: {
					type: 1
				}
			};
			await discordDispatcher.dispatch(message, {
				createMessage: (msg, channel) => {},
				id: 100,
				type: 0
			});
			expect(spyGetGuildTop.callCount).equal(1);
			expect(spyGetGuildTopByField.callCount).equal(1);
			expect(spyStringGuildTop.callCount).equal(1);
		});
		it('should return units with top-health for guild', async function () {
			const message: IDiscordMessage = {
				content: 'swr -gtu -rank=health',
				author: {
					id: '590913433738936329',
					username: 'Test',
					bot: false
				},
				channel: {
					type: 1
				}
			};
			await discordDispatcher.dispatch(message, {
				createMessage: (msg, channel) => {},
				id: 100,
				type: 0
			});
			expect(spyGetGuildTop.callCount).equal(1);
			expect(spyGetGuildTopByField.callCount).equal(1);
			expect(spyStringGuildTop.callCount).equal(1);
		});
		it('should return units with top-defense for guild', async function () {
			const message: IDiscordMessage = {
				content: 'swr -gtu -rank=defense',
				author: {
					id: '590913433738936329',
					username: 'Test',
					bot: false
				},
				channel: {
					type: 1
				}
			};
			await discordDispatcher.dispatch(message, {
				createMessage: (msg, channel) => {},
				id: 100,
				type: 0
			});
			expect(spyGetGuildTop.callCount).equal(1);
			expect(spyGetGuildTopByField.callCount).equal(1);
			expect(spyStringGuildTop.callCount).equal(1);
		});
		it('should return units with top-damage for guild', async function () {
			const message: IDiscordMessage = {
				content: 'swr -gtu -rank=damage',
				author: {
					id: '590913433738936329',
					username: 'Test',
					bot: false
				},
				channel: {
					type: 1
				}
			};
			await discordDispatcher.dispatch(message, {
				createMessage: (msg, channel) => {},
				id: 100,
				type: 0
			});
			expect(spyGetGuildTop.callCount).equal(1);
			expect(spyGetGuildTopByField.callCount).equal(1);
			expect(spyStringGuildTop.callCount).equal(1);
		});
		it('should return units with top-defense for guild', async function () {
			const message: IDiscordMessage = {
				content: 'swr -gtu -rank=defense',
				author: {
					id: '590913433738936329',
					username: 'Test',
					bot: false
				},
				channel: {
					type: 1
				}
			};
			await discordDispatcher.dispatch(message, {
				createMessage: (msg, channel) => {},
				id: 100,
				type: 0
			});
			expect(spyGetGuildTop.callCount).equal(1);
			expect(spyGetGuildTopByField.callCount).equal(1);
			expect(spyStringGuildTop.callCount).equal(1);
		});
		it('should return units with top-potency for guild', async function () {
			const message: IDiscordMessage = {
				content: 'swr -gtu -rank=potency',
				author: {
					id: '590913433738936329',
					username: 'Test',
					bot: false
				},
				channel: {
					type: 1
				}
			};
			await discordDispatcher.dispatch(message, {
				createMessage: (msg, channel) => {},
				id: 100,
				type: 0
			});
			expect(spyGetGuildTop.callCount).equal(1);
			expect(spyGetGuildTopByField.callCount).equal(1);
			expect(spyStringGuildTop.callCount).equal(1);
		});
		it('should return units with top-tenacity for guild', async function () {
			const message: IDiscordMessage = {
				content: 'swr -gtu -rank=tenacity',
				author: {
					id: '590913433738936329',
					username: 'Test',
					bot: false
				},
				channel: {
					type: 1
				}
			};
			await discordDispatcher.dispatch(message, {
				createMessage: (msg, channel) => {},
				id: 100,
				type: 0
			});
			expect(spyGetGuildTop.callCount).equal(1);
			expect(spyGetGuildTopByField.callCount).equal(1);
			expect(spyStringGuildTop.callCount).equal(1);
		});
		it('should return units with top-protection for guild', async function () {
			const message: IDiscordMessage = {
				content: 'swr -gtu -rank=protection',
				author: {
					id: '590913433738936329',
					username: 'Test',
					bot: false
				},
				channel: {
					type: 1
				}
			};
			await discordDispatcher.dispatch(message, {
				createMessage: (msg, channel) => {},
				id: 100,
				type: 0
			});
			expect(spyGetGuildTop.callCount).equal(1);
			expect(spyGetGuildTopByField.callCount).equal(1);
			expect(spyStringGuildTop.callCount).equal(1);
		});
		it('should not return results for wrong rank for guild', async function () {
			const message: IDiscordMessage = {
				content: 'swr -gtu -rank=blablabla',
				author: {
					id: '590913433738936329',
					username: 'Test',
					bot: false
				},
				channel: {
					type: 1
				}
			};
			await discordDispatcher.dispatch(message, {
				createMessage: (msg, channel) => {},
				id: 100,
				type: 0
			});
			expect(spyGetGuildTop.callCount).equal(1);
			expect(spyGetGuildTopByField.callCount).equal(0);
			expect(spyStringGuildTop.callCount).equal(0);
		});
	});
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
	xit('should create idea in db', async function () {
		const message: IDiscordMessage = {
			content: 'swr -i hi, I am idea',
			author: {
				id: '590913433738936329',
				username: 'Test',
				bot: false
			},
			channel: {
				type: 1
			}
		};
		await discordDispatcher.dispatch(message, {
			createMessage: (msg, channel) => {},
			id: 100,
			type: 0
		});
	});
});
