import * as amqp from 'amqplib/callback_api';
import { Observable, Subject} from 'rxjs';
import { throwError } from 'rxjs/internal/observable/throwError';
import { merge } from 'rxjs/internal/observable/merge';
import { UserModel } from '../db/models/user.model';
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

					// channel.assertExchange(this.encounterExchange, 'topic', {durable: false});

					channel.assertQueue('', {exclusive: true}, (error, que) => {
						if (error) {
							merge(exchangeSubject, throwError(new Error(error)));
						}

						channel.bindQueue(que.queue, this.encounterExchange, this.encounterTopic);

						channel.consume(que.queue, (message) => {
							console.log('----MQ Message----')
							console.log(message)
							console.log(message.content.toString())
							exchangeSubject.next(message);
						}, {noAck: true});
					})
				});
			});
			return exchangeSubject.asObservable();
		}

		public createMqAccount(user: UserModel): void {
			console.error('---------- create MQ account ---------------')
			let request = http.request({
				hostname: 'localhost',
				port: 15672,
				method: 'PUT',
				path: '/' + user._id
			}, (response) => {
				response.setEncoding('utf8');
				response.on('data', (chunk) => {
					console.log(`BODY: ${chunk}`)
				});
				response.on('end', () => {
					console.log('response ended')
				})
			});

			request.on('error', (error) => {
				throw new Error(error.message);
			});

			request.write(JSON.stringify({
				password: user.passwordHash
			}));
			request.end();
			console.log('----------------account created-----------------')
		}
}