import { NgModule } from '@angular/core';
import { ChatComponent } from './chat.component';
import { MatCardModule, MatToolbarModule } from '@angular/material';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MqService } from '../mq/mq.service';
import { StompRService } from '@stomp/ng2-stompjs';
import { MessageService } from '../data-services/message.service';
import { AngularDraggableModule } from 'angular2-draggable';

@NgModule({
	imports: [
			MatCardModule,
			DragDropModule,
			MatToolbarModule,
			AngularDraggableModule
	],
	declarations: [
			ChatComponent,
	],
	exports: [
			ChatComponent,
	],
	providers: [
		StompRService,
		MqService,
		MessageService,
	]
})
export class ChatModule {

}