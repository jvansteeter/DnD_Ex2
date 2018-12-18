import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChatRoomData } from '../../../../shared/types/mq/chat-room.data';

@Injectable()
export class ChatRepository {

	constructor(private http: HttpClient) {

	}

	public getAllChatRooms(): Observable<ChatRoomData[]> {
		return this.http.get<ChatRoomData[]>('/api/chat/chatrooms', {responseType: 'json'});
	}

	public createChatRoom(): Observable<ChatRoomData> {
		return this.http.post<ChatRoomData>('/api/chat/new/room', {}, {responseType: 'json'});
	}
}
