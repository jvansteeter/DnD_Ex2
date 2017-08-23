import { NgModule } from '@angular/core';
import { CharacterMakerComponent } from './character-maker.component';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    MdAutocompleteModule,
    MdButtonModule, MdCardModule, MdCheckboxModule, MdDialogModule, MdGridListModule, MdIconModule, MdInputModule,
    MdMenuModule,
    MdSelectModule
} from '@angular/material';
import { AddComponentComponent } from './dialog/add-component.component';
import { CharacterMakerService } from './character-maker.service';
import { TextComponent } from './subcomponents/text/text.component';
import { SubComponent } from "./subcomponents/sub-component";
import { SubComponentService } from "./subcomponents/sub-component.service";
import { CheckboxComponent } from './subcomponents/checkbox/checkbox.component';
import { NumberComponent } from './subcomponents/number/number.component';
import { CheckboxListComponent } from './subcomponents/checkbox-list/checkbox-list.component';
import { TextListComponent } from './subcomponents/text-list/text-list.component';


@NgModule({
    imports: [
        FormsModule,
        BrowserModule,
        BrowserAnimationsModule,
        MdInputModule,
        MdDialogModule,
        MdButtonModule,
        MdIconModule,
        MdSelectModule,
        MdCheckboxModule,
        MdAutocompleteModule,
        MdCardModule,
        MdGridListModule,
        MdMenuModule
    ],
    declarations: [
        CharacterMakerComponent,
        AddComponentComponent,
        SubComponent,
        TextComponent,
        CheckboxComponent,
        NumberComponent,
        CheckboxListComponent,
        TextListComponent
    ],
    exports: [
        CharacterMakerComponent
    ],
    entryComponents: [
        AddComponentComponent
    ],
    providers: [
        CharacterMakerService,
        SubComponentService
    ]
})
export class CharacterMakerModule {

}
