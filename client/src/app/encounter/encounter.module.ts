import { NgModule } from "@angular/core";
import { EncounterService } from "./encounter.service";
import { EncounterComponent } from "./encounter.component";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { EncounterRepository } from "../repositories/encounter.repository";
import { BoardModule } from '../board/board.module';
import { EncounterConcurrencyService } from './encounter-concurrency.service';
import { MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule } from '@angular/material';
import { EncounterKeyEventService } from "./encounter-key-event.service";
import { SendGlobalAnnouncementDialogComponent } from './announcement/send-global-announcement-dialog.component';
import { ShowGlobalAnnouncementDialogComponent } from './announcement/show-global-announcement-dialog.component';

@NgModule({
	imports: [
		FormsModule,
		BrowserModule,
		BoardModule,
		MatButtonModule,
		MatIconModule,
		MatFormFieldModule,
		MatInputModule,
	],
	declarations: [
		EncounterComponent,
		SendGlobalAnnouncementDialogComponent,
		ShowGlobalAnnouncementDialogComponent,
	],
	providers: [
		EncounterService,
		EncounterRepository,
		EncounterConcurrencyService,
		EncounterKeyEventService,
	],
	entryComponents: [
		SendGlobalAnnouncementDialogComponent,
		ShowGlobalAnnouncementDialogComponent,
	],
	exports: [
		EncounterComponent
	]
})
export class EncounterModule {

}
