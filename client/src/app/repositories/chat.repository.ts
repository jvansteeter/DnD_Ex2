import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChatRoomData } from '../../../../shared/types/mq/chat-room.data';
import { ChatMessage } from '../../../../shared/types/mq/chat';

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

	public addUserToRoom(userId: string, roomId: string): Observable<ChatRoomData> {
		const data = {
			userId: userId,
			roomId: roomId
		};
		return this.http.post<ChatRoomData>('/api/chat/adduser', data, {responseType: 'json'});
	}

	public saveChat(chat: ChatMessage): Observable<void> {
		const data = {
			chat: chat
		};
		return this.http.post<void>('/api/chat/save', data);
	}

	public getOrCreateRoomOfUsers(userIds: string[]): Observable<ChatRoomData> {
		const data = {
			userIds: userIds
		};
		return this.http.post<ChatRoomData>('/api/chat/roomOfUsers', data, {responseType: 'json'});
	}
}
