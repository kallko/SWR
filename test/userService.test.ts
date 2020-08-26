import { expect } from 'chai';
import { userService } from '../server-src/service/UserService';
xdescribe('UserService tests:', async function () {
	it('return null if User not registered', async function () {
		const result = await userService.getUser({
			allyCode: 1111,
			discordId: 23232
		});
		expect(result).eq(null);
	});
});
