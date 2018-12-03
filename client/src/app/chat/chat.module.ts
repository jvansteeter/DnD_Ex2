import { NgModule } from '@angular/core';
import { ChatComponent } from './chat.component';
import { MatButtonModule, MatCardModule, MatTabsModule, MatToolbarModule } from '@angular/material';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MqService } from '../mq/mq.service';
import { StompRService } from '@stomp/ng2-stompjs';
import { AngularDraggableModule } from 'angular2-draggable';
import { ChatService } from '../data-services/chat.service';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

@NgModule({
	imports: [
			BrowserModule,
			FormsModule,
			MatCardModule,
			DragDropModule,
			MatToolbarModule,
			AngularDraggableModule,
			MatTabsModule,
			MatButtonModule,
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
		ChatService,
	]
})
export class ChatModule {

}