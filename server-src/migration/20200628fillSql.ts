import { readWriteService } from '../service/readWriteService';
import { createUser } from '../service/dbService';

export async function fillUsers() {
	const usersResp = await readWriteService.readJson('registration/registr.json');
	const users = await JSON.parse(usersResp);
	for (let i: number = 0; i < users.length; i++) {
		await createUser(users[i]);
	}
	// todo create User;
}
