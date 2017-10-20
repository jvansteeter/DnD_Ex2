import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CharacterSheetComponent } from './sheet/character-sheet.component';
import { CharacterSheetRepository } from './sheet/character-sheet.repository';
import { SubComponentImmutable } from './shared/subcomponents/sub-component-immutable';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {
    MatAutocompleteModule, MatButtonModule, MatCardModule, MatCheckboxModule, MatChipsModule, MatDialogModule,
    MatGridListModule,
    MatIconModule, MatInputModule,
    MatMenuModule, MatSelectModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FunctionDialogComponent, NodePipe } from './shared/subcomponents/function/function-dialog.component';
import { FunctionComponent } from './shared/subcomponents/function/function.component';
import { TokenComponent } from './shared/subcomponents/token/token.component';
import { CategoryComponent } from './shared/subcomponents/category/category.component';
import { TextListComponent } from './shared/subcomponents/text-list/text-list.component';
import { CheckboxListComponent } from './shared/subcomponents/checkbox-list/checkbox-list.component';
import { NumberComponent } from './shared/subcomponents/number/number.component';
import { CheckboxComponent } from './shared/subcomponents/checkbox/checkbox.component';
import { TextComponent } from './shared/subcomponents/text/text.component';
import { AddComponentComponent } from './maker/dialog/add-component.component';
import { CharacterMakerComponent } from './maker/character-maker.component';
import { SubComponent } from './shared/subcomponents/sub-component';
import { SubComponentService } from './shared/subcomponents/sub-component.service';
import { CharacterMakerService } from './maker/character-maker.service';
import { CharacterSheetService } from './sheet/character-sheet.service';
import { CharacterInterfaceFactory } from './shared/character-interface.factory';

@NgModule({
    imports: [
        FormsModule,
        BrowserModule,
        HttpClientModule,
        MatCardModule,
        BrowserAnimationsModule,
        MatInputModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
        MatCheckboxModule,
        MatAutocompleteModule,
        MatGridListModule,
        MatMenuModule,
        MatChipsModule
    ],
    declarations: [
        CharacterSheetComponent,
        SubComponent,
        CharacterMakerComponent,
        AddComponentComponent,
        SubComponentImmutable,
        TextComponent,
        CheckboxComponent,
        NumberComponent,
        CheckboxListComponent,
        TextListComponent,
        CategoryComponent,
        TokenComponent,
        FunctionComponent,
        FunctionDialogComponent,
        NodePipe
    ],
    providers: [
        CharacterSheetRepository,
        CharacterMakerService,
        CharacterSheetService,
        CharacterInterfaceFactory,
        SubComponentService
    ],
    entryComponents: [
        AddComponentComponent,
        FunctionDialogComponent
    ],
    exports: [
        CharacterSheetComponent,
        CharacterMakerComponent
    ]
})
export class CharacterSheetModule {

}
