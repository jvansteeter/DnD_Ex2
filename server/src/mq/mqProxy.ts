import * as amqp from 'amqplib/callback_api';
import { Observable, Subject } from 'rxjs';
import { throwError } from 'rxjs/internal/observable/throwError';
import { merge } from 'rxjs/internal/observable/merge';
import { UserModel } from '../db/models/user.model';
import { Promise } from 'bluebird';
import * as http from 'http';
import { MqConfig } from '../config/mqConfig';

export class MqProxy {

	private connection;

	public connect(): Promise<void> {
		return new Promise((resolve, reject) => {
			amqp.connect(MqConfig.amqpUrl, (error, connection) => {
				if (error) {
					reject(error);
					return;
				}

				connection.createChannel((error, channel) => {
					if (error) {
						reject(error);
						return;
					}

					channel.assertExchange(MqConfig.encounterExchange, 'topic', {durable: true});
					channel.assertQueue(MqConfig.encounterQueueName, {durable: true}, (error) => {
						if (error) {
							reject(error);
							return;
						}
						this.connection = connection;
						resolve();
					});
				});
			});
		});
	}

	public disconnect(): void {
		if (this.connection) {
			this.connection.close();
		}
	}

	public ObserveAllEncounters(): Observable<any> {
		if (!this.connection) {
			return throwError('Not connected to MQ Server');
		}
		let exchangeSubject = new Subject<any>();
		this.connection.createChannel((error, channel) => {
			if (error) {
				merge(exchangeSubject, throwError(new Error(error)));
			}

			channel.bindQueue(MqConfig.encounterQueueName, MqConfig.encounterExchange, MqConfig.encounterTopic);
			channel.consume(MqConfig.encounterQueueName, (message) => {
				exchangeSubject.next(message);
			}, {noAck: true});
		});
		return exchangeSubject.asObservable();
	}

	public createMqAccount(user: UserModel): Promise<void> {
		return new Promise((resolve, reject) => {
			let request = http.request({
				hostname: MqConfig.hostname,
				port: MqConfig.port,
				method: 'PUT',
				path: '/api/users/' + user._id,
				auth: MqConfig.auth,
				headers: {
					'Content-Type': 'application/json',
				}
			}, async (response) => {
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
				hostname: MqConfig.hostname,
				port: MqConfig.port,
				method: 'PUT',
				path: '/api/permissions/' + MqConfig.vHost + '/' + user._id,
				auth: MqConfig.auth,
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
				hostname: MqConfig.hostname,
				port: MqConfig.port,
				method: 'PUT',
				path: '/api/topic-permissions/' + MqConfig.vHost + '/' + user._id,
				auth: MqConfig.auth,
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
				exchange: MqConfig.encounterExchange,
				write: MqConfig.encounterTopic,
				read: MqConfig.encounterTopic
			}));
			request.end();
		});
	}
}

export const MqProxySingleton: MqProxy = new MqProxy();