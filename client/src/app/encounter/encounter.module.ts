import { NgModule } from "@angular/core";
import { EncounterService } from "./encounter.service";
import { EncounterComponent } from "./encounter.component";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { EncounterRepository } from "../repositories/encounter.repository";
import { BoardModule } from '../board/board.module';
import { EncounterConcurrencyService } from './encounter-concurrency.service';
import { MatButtonModule, MatIconModule } from '@angular/material';
import { EncounterKeyEventService } from "./encounter-key-event.service";

@NgModule({
	imports: [
		FormsModule,
		BrowserModule,
		BoardModule,
		MatButtonModule,
		MatIconModule,
	],
	declarations: [
		EncounterComponent
	],
	providers: [
		EncounterService,
		EncounterRepository,
		EncounterConcurrencyService,
		EncounterKeyEventService,
	],
	entryComponents: [],
	exports: [
		EncounterComponent
	]
})
export class EncounterModule {

}
