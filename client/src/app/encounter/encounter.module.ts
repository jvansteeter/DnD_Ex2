import { NgModule } from "@angular/core";
import { EncounterService } from "./encounter.service";
import { EncounterComponent } from "./encounter.component";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { EncounterRepository } from "../repositories/encounter.repository";
import { BoardModule } from '../board/board.module';
import { EncounterConcurrencyService } from './encounter-concurrency.service';

@NgModule({
	imports: [
		FormsModule,
		BrowserModule,
		BoardModule
	],
	declarations: [
		EncounterComponent
	],
	providers: [
		EncounterService,
		EncounterRepository,
		EncounterConcurrencyService,
	],
	entryComponents: [],
	exports: [
		EncounterComponent
	]
})
export class EncounterModule {

}
