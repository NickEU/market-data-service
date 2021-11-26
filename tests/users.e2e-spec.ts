import { App } from '../src/app';
import { boot } from '../src/main';
import request from 'supertest';

let application: App;
const userEmail = 'hello@nick.tf';
const userPassword = 'qwerty';

beforeAll(async () => {
	const { app } = await boot;
	application = app;
});

describe('Users e2e', () => {
	it('Register - error', async () => {
		const res = await request(application.app)
			.post('/users/register')
			.send({ email: userEmail, password: 'hello' });
		expect(res.statusCode).toBe(422);
	});

	it('Login - success', async () => {
		const res = await request(application.app)
			.post('/users/login')
			.send({ email: userEmail, password: userPassword });
		expect(res.body.jwt).not.toBeUndefined();
	});

	it('Login - error', async () => {
		const res = await request(application.app)
			.post('/users/login')
			.send({ email: userEmail, password: userPassword + 's' });
		expect(res.statusCode).toBe(401);
	});

	it('Info - success', async () => {
		const login = await request(application.app)
			.post('/users/login')
			.send({ email: userEmail, password: userPassword });
		const res = await request(application.app)
			.get('/users/info')
			.set('Authorization', `Bearer ${login.body.jwt}`);
		expect(res.body.email).toBe(userEmail);
	});

	it('Info - fail', async () => {
		const login = await request(application.app)
			.post('/users/login')
			.send({ email: userEmail, password: userPassword });
		const res = await request(application.app)
			.get('/users/info')
			.set('Authorization', `Bearer ${login.body.jwt}sd`);
		expect(res.body.email).toBeUndefined();
	});
});

afterAll(() => {
	application.close();
});
