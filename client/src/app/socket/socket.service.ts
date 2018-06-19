import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { SocketApiLoader } from './socketApiLoader';
import { StompService } from "@stomp/ng2-stompjs";
import { Message } from '@stomp/stompjs';

declare const io: any;

@Injectable()
export class SocketService {
	private socketLoadedPromise;
	private socket;

	constructor(private stompService: StompService) {
		this.socketLoadedPromise = new Promise((resolve, reject) => {
			new SocketApiLoader().load().then(() => {
				this.socket = io.connect();
				resolve();
			}).catch(error => reject(error));
		});

		this.stompService.subscribe('/queue/hello').subscribe((message: Message) => {
			console.log('hello queue')
			console.log(message)
		});
	}

	on(eventName: string): Subject<any> {
		let subject = new Subject<any>();
		this.socketLoadedPromise.then(() => {
			this.socket.on(eventName, (data) => {
				subject.next(data);
			});
		});

		return subject;
	}

	emit(eventName: string, data: any): void {
		this.socketLoadedPromise.then(() => {
			this.socket.emit(eventName, data);
		});
	}
}