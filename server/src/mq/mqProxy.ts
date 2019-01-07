import * as amqp from 'amqplib/callback_api';
import { Observable, Subject, throwError } from 'rxjs';
import { UserModel } from '../db/models/user.model';
import { Promise } from 'bluebird';
import * as http from 'http';
import { MqConfig } from '../config/mqConfig';
import { merge } from 'rxjs/internal/observable/merge';
import { FriendRequest } from '../../../shared/types/mq/FriendRequest';
import { FriendRequestMessage } from './messages/friend-request.message';
import { MqFactory } from './mq.factory';
import { CampaignInvite } from '../../../shared/types/mq/campaign-invite';
import { CampaignInviteMessage } from './messages/campaign-invite.message';
import { MqError } from '../../../shared/errors/MqError';
import { EncounterCommandMessage } from './messages/encounter-command.message';
import { EncounterCommand } from '../../../shared/types/mq/encounter-command';
import { ChatMessage } from '../../../shared/types/mq/chat';
import { ChatRoomModel } from '../db/models/chat-room.model';
import { ChatType } from '../../../shared/types/mq/chat-type.enum';

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
						channel.assertExchange(MqConfig.campaignExchange, 'topic', {durable: true});
						await this.createServerQueue(channel, MqConfig.encounterQueueName);
						await this.createServerQueue(channel, MqConfig.friendRequestQueueName);
						await this.createServerQueue(channel, MqConfig.campaignInviteQueueName);
						this.connection = connection;
						resolve();
					} catch (error) {
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

	public observeAllEncounters(): Observable<EncounterCommandMessage> {
		if (!this.connection) {
			return throwError('Not connected toUserId MQ Server');
		}
		let exchangeSubject = new Subject<EncounterCommandMessage>();
		this.connection.createChannel((error, channel) => {
			if (error) {
				merge(exchangeSubject, throwError(new Error(error)));
			}

			channel.bindQueue(MqConfig.encounterQueueName, MqConfig.encounterExchange, MqConfig.encounterTopic);
			channel.consume(MqConfig.encounterQueueName, (message) => {
				exchangeSubject.next(new EncounterCommandMessage(message));
			}, {noAck: true});
		});
		return exchangeSubject.asObservable();
	}

	public observeAllFriendRequests(): Observable<FriendRequest> {
		if (!this.connection) {
			return throwError('Not connected to MQ Server');
		}
		let friendRequestSubject = new Subject<FriendRequest>();
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

	public observeAllCampaignInvites(): Observable<CampaignInvite> {
		if (!this.connection) {
			return throwError('Not connected to MQ Server');
		}
		let campaignInviteSubject = new Subject<CampaignInvite>();
		this.connection.createChannel((error, channel) => {
			if (error) {
				merge(campaignInviteSubject, throwError(new Error(error)));
			}

			channel.bindQueue(MqConfig.campaignInviteQueueName, MqConfig.userExchange, MqConfig.campaignInviteTopic);
			channel.consume(MqConfig.campaignInviteQueueName, (message) => {
				campaignInviteSubject.next(new CampaignInviteMessage(message));
			});
		});

		return campaignInviteSubject.asObservable();
	}

	public async sendEncounterCommand(encounterId: string, encounterUpdate: EncounterCommand): Promise<void> {
		if (!this.connection) {
			throw new Error(MqError.NOT_CONNECTED);
		}
		this.connection.createChannel((error, channel) => {
			if (error) {
				throw new Error(MqError.CHANNEL);
			}

			const options = {headers: encounterUpdate.headers};
			channel.publish(MqConfig.encounterExchange, 'encounter.' + encounterId, new Buffer(JSON.stringify(encounterUpdate.body)), options);
			return;
		});
	}

	public async sendChat(room: ChatRoomModel, chat: ChatMessage): Promise<void> {
		if (!this.connection) {
			throw new Error(MqError.NOT_CONNECTED);
		}

		const channel = await this.connection.createChannel();
		if (room.chatType === ChatType.USER) {
			for (let userId of room.userIds) {
				const options = {headers: JSON.parse(JSON.stringify(chat.headers))};
				options.headers.timestamp = String(options.headers.timestamp);
				channel.publish(MqConfig.userExchange, 'user.' + userId + '.chat', new Buffer(chat.body), options);
			}
		}
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
				await this.grantExchangeAccess(user, MqConfig.campaignExchange, MqConfig.campaignTopic, MqConfig.campaignTopic);
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

	public userHasMqAccount(user: UserModel): Promise<boolean> {
		return new Promise((resolve, reject) => {
			let request = http.request({
				hostname: MqConfig.hostname,
				port: MqConfig.port,
				method: 'GET',
				path: '/api/users/' + user._id,
				auth: MqConfig.auth,
				headers: {
					'Content-Type': 'application/json',
				}
			}, (response) => {
				if (response.statusCode === 200) {
					resolve(true);
				}
				resolve(false);
			});

			request.on('error', (error) => {
				reject(new Error(error.message));
			});

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
				write: writeExp,
				read: readExp
			}));
			request.end();
		});
	}

	private createServerQueue(channel, queueName: string): Promise<void> {
		return new Promise((resolve, reject) => {
			channel.assertQueue(queueName, {durable: false, autoDelete: true}, (error) => {
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