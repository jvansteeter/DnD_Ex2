import * as amqp from 'amqplib/callback_api';
import { Observable, Subject, throwError } from 'rxjs';
import { UserModel } from '../db/models/user.model';
import { Promise } from 'bluebird';
import * as http from 'http';
import { MqConfig } from '../config/mqConfig';
import { merge } from 'rxjs/internal/observable/merge';
import { EncounterUpdateMessage } from './encounter-update.message';
import { FriendRequest } from '../../../shared/types/mq/FriendRequest';
import { FriendRequestMessage } from './friend-request.message';
import { MqFactory } from './mq.factory';

export class MqProxy {

	private connection;

	public connect(): Promise<void> {
		return new Promise((resolve, reject) => {
			amqp.connect(MqConfig.amqpUrl, (error, connection) => {
				if (error) {
					reject(error);
					return;
				}

				connection.createChannel(async (error, channel) => {
					if (error) {
						reject(error);
						return;
					}

					try {
						channel.assertExchange(MqConfig.encounterExchange, 'topic', {durable: true});
						channel.assertExchange(MqConfig.userExchange, 'topic', {durable: true});
						await this.createEncounterQueue(channel);
						await this.createFriendRequestQueue(channel);
						this.connection = connection;
						resolve();
					}
					catch (error) {
						reject(error);
					}
				});
			});
		});
	}

	public disconnect(): void {
		if (this.connection) {
			this.connection.close();
		}
	}

	public observeAllEncounters(): Observable<EncounterUpdateMessage> {
		if (!this.connection) {
			return throwError('Not connected to MQ Server');
		}
		let exchangeSubject = new Subject<EncounterUpdateMessage>();
		this.connection.createChannel((error, channel) => {
			if (error) {
				merge(exchangeSubject, throwError(new Error(error)));
			}

			channel.bindQueue(MqConfig.encounterQueueName, MqConfig.encounterExchange, MqConfig.encounterTopic);
			channel.consume(MqConfig.encounterQueueName, (message) => {
				// console.log(message);
				exchangeSubject.next(new EncounterUpdateMessage(message));
			}, {noAck: true});
		});
		return exchangeSubject.asObservable();
	}

	public observeAllFriendRequests(): Observable<FriendRequest> {
		if (!this.connection) {
			return throwError('Not connected to MQ Server');
		}
		let friendRequestSubject = new Subject<any>();
		this.connection.createChannel((error, channel) => {
			if (error) {
				merge(friendRequestSubject, throwError(new Error(error)));
			}

			channel.bindQueue(MqConfig.friendRequestQueueName, MqConfig.userExchange, MqConfig.friendRequestTopic);
			channel.consume(MqConfig.friendRequestQueueName, (message) => {
				friendRequestSubject.next(new FriendRequestMessage(message));
			});
		});

		return friendRequestSubject.asObservable();
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
				await this.grantExchangeAccess(user, MqConfig.encounterExchange, MqConfig.encounterTopic, MqConfig.encounterTopic);
				await this.grantExchangeAccess(user, MqConfig.userExchange, MqFactory.createUserExchangeReadExp(user._id), MqFactory.createUserExchangeWriteExp());
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

	private grantExchangeAccess(user: UserModel, exchange: string, readExp: string, writeExp: string): Promise<void> {
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
				exchange: exchange,
				write: readExp,
				read: writeExp
			}));
			request.end();
		});
	}

	private createEncounterQueue(channel): Promise<void> {
		return new Promise((resolve, reject) => {
			channel.assertQueue(MqConfig.encounterQueueName, {durable: true}, (error) => {
				if (error) {
					reject(error);
					return;
				}
				resolve();
			});
		});
	}

	private createFriendRequestQueue(channel): Promise<void> {
		return new Promise((resolve, reject) => {
			channel.assertQueue(MqConfig.friendRequestQueueName, {durable: true}, (error) => {
				if (error) {
					reject(error);
					return;
				}
				resolve();
			});
		});
	}
}

export const MqProxySingleton: MqProxy = new MqProxy();