import { Pipe, PipeTransform } from '@angular/core';
import { UserProfileService } from '../data-services/userProfile.service';
import { SocialService } from '../social/social.service';
import { ChatRoom } from './chat-room';
import { ChatType } from '../../../../shared/types/mq/chat-type.enum';

@Pipe({
	name: 'chatRoomLabel',
	pure: false
})
export class ChatRoomLabelPipe implements PipeTransform {
	constructor(private userProfileService: UserProfileService,
	            private socialService: SocialService) {

	}

	transform(room: ChatRoom): any {
		if (room.userIds.length <= 1) {
			return 'New';
		}
		let label = '';
		if (room.chatType === ChatType.USER) {
			for (let userId of room.userIds) {
				if (userId !== this.userProfileService.userId) {
					label += ', ' + this.socialService.getUsernameByUserId(userId);
				}
			}
			label = label.substr(2);
		}

		return label;
	}
}