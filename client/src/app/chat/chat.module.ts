import { NgModule } from '@angular/core';
import { ChatComponent } from './chat.component';
import {
	MatAutocompleteModule, MatBadgeModule,
	MatButtonModule,
	MatCardModule,
	MatChipsModule,
	MatFormFieldModule, MatIconModule,
	MatTabsModule,
	MatToolbarModule
} from '@angular/material';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MqService } from '../mq/mq.service';
import { StompRService } from '@stomp/ng2-stompjs';
import { AngularDraggableModule } from 'angular2-draggable';
import { ChatService } from '../data-services/chat.service';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UtilityModule } from '../utilities/utility.module';
import { ScrollingModule } from '@angular/cdk/scrolling';

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
			MatFormFieldModule,
			MatChipsModule,
			MatAutocompleteModule,
			ReactiveFormsModule,
			MatIconModule,
			UtilityModule,
			MatBadgeModule,
			ScrollingModule,
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