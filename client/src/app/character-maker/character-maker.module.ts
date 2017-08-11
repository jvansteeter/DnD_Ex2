import { NgModule } from '@angular/core';
import { CharacterMakerComponent } from './character-maker.component';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    MdAutocompleteModule,
    MdButtonModule, MdCheckboxModule, MdDialogModule, MdIconModule, MdInputModule,
    MdSelectModule
} from '@angular/material';
import { AddComponentComponent } from './dialog/add-component.component';
import { AddComponentService } from './add-component.service';


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
        MdAutocompleteModule
    ],
    declarations: [
        CharacterMakerComponent,
        AddComponentComponent
    ],
    exports: [
        CharacterMakerComponent
    ],
    entryComponents: [
        AddComponentComponent
    ],
    providers: [
        AddComponentService
    ]
})
export class CharacterMakerModule {

}
