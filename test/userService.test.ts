import { expect } from 'chai';
import { userService } from '../server-src/service/UserService';
const sinon = require('sinon');
describe('UserService tests:', async function () {
	it('return null if User not registered', async function () {
		const result = await userService.getAllyCodeForDiscord(1111);
		expect(result).eq(null);
	});
});
