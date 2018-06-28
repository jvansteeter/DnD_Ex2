import * as amqp from 'amqplib/callback_api';
import { Observable, Subject} from 'rxjs';
import { throwError } from 'rxjs/internal/observable/throwError';
import { merge } from 'rxjs/internal/observable/merge';
import { UserModel } from '../db/models/user.model';
import { Promise } from 'bluebird';
import * as http from 'http';

export class MqService {
		private amqpUrl = 'amqp://admin:admin@localhost';
		private encounterExchange = 'encounterExchange';
		private encounterTopic = 'encounter.*';

		public subscribeAllEncounters(): Observable<any> {
			let exchangeSubject = new Subject<any>();
			amqp.connect(this.amqpUrl, (error, connection) => {
				if (error) {
					merge(exchangeSubject, throwError(new Error(error)));
				}
				connection.createChannel((error, channel) => {
					if (error) {
						merge(exchangeSubject, throwError(new Error(error)));
					}

					channel.assertQueue('', {exclusive: true}, (error, que) => {
						if (error) {
							merge(exchangeSubject, throwError(new Error(error)));
						}

						channel.bindQueue(que.queue, this.encounterExchange, this.encounterTopic);
						channel.consume(que.queue, (message) => {
							// console.log(message)
							// console.log(message.content.toString())
							exchangeSubject.next(message.content.toString());
						}, {noAck: true});
					})
				});
			});
			return exchangeSubject.asObservable();
		}

		public createMqAccount(user: UserModel): Promise<void> {
			return new Promise((resolve, reject) => {
				let request = http.request({
					hostname: 'localhost',
					port: 15672,
					method: 'PUT',
					path: '/api/users/' + user._id,
					auth: 'admin:admin',
					headers: {
						'Content-Type': 'application/json',
					}
				},  async (response) => {
					response.setEncoding('utf8');
					await this.grantUserVHostAccess(user);
					await this.grantUserExchangeAccess(user);
					resolve();
				});

				request.on('error', (error) => {
					reject(new Error(error.message));
				});

				request.write(JSON.stringify({
					password: user.passwordHash,
					tags: 'user'
				}));
				request.end();
			});

		}

		private grantUserVHostAccess(user: UserModel): Promise<void> {
			return new Promise((resolve, reject) => {
				let request = http.request({
					hostname: 'localhost',
					port: 15672,
					method: 'PUT',
					path: '/api/permissions/%2f/' + user._id,
					auth: 'admin:admin',
					headers: {
						'Content-Type': 'application/json',
					}
				}, (response) => {
					response.setEncoding('utf8');
					resolve();
				});

				request.on('error', (error) => {
					reject(new Error(error.message));
				});

				request.write(JSON.stringify({
					configure: '.*',
					write: '.*',
					read: '.*'
				}));
				request.end();
			});
		}

	private grantUserExchangeAccess(user: UserModel): Promise<void> {
		return new Promise((resolve, reject) => {
			let request = http.request({
				hostname: 'localhost',
				port: 15672,
				method: 'PUT',
				path: '/api/topic-permissions/%2f/' + user._id,
				auth: 'admin:admin',
				headers: {
					'Content-Type': 'application/json',
				}
			}, (response) => {
				response.setEncoding('utf8');
				resolve();
			});

			request.on('error', (error) => {
				reject(new Error(error.message));
			});

			request.write(JSON.stringify({
				exchange: 'encounterExchange',
				write: 'encounter.*',
				read: 'encounter.*'
			}));
			request.end();
		});
	}
}