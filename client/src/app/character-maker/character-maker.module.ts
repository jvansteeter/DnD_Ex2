import { NgModule } from '@angular/core';
import { CharacterMakerComponent } from './character-maker.component';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddComponentComponent } from './dialog/add-component.component';
import { CharacterMakerService } from './character-maker.service';
import { TextComponent } from './subcomponents/text/text.component';
import { SubComponent } from "./subcomponents/sub-component";
import { SubComponentService } from "./subcomponents/sub-component.service";
import { CheckboxComponent } from './subcomponents/checkbox/checkbox.component';
import { NumberComponent } from './subcomponents/number/number.component';
import { CheckboxListComponent } from './subcomponents/checkbox-list/checkbox-list.component';
import { TextListComponent } from './subcomponents/text-list/text-list.component';
import { CategoryComponent } from './subcomponents/category/category.component';
import { TokenComponent } from './subcomponents/token/token.component';
import { FunctionComponent } from './subcomponents/function/function.component';
import { FunctionDialogComponent, NodePipe } from './subcomponents/function/function-dialog.component';
import { HttpClientModule } from '@angular/common/http';
import {
    MatAutocompleteModule,
    MatButtonModule, MatCardModule, MatCheckboxModule, MatChipsModule, MatDialogModule, MatGridListModule,
    MatIconModule,
    MatInputModule, MatMenuModule,
    MatSelectModule
} from '@angular/material';


@NgModule({
    imports: [
        FormsModule,
        BrowserModule,
        BrowserAnimationsModule,
        MatInputModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
        MatCheckboxModule,
        MatAutocompleteModule,
        MatCardModule,
        MatGridListModule,
        MatMenuModule,
        MatChipsModule,
        HttpClientModule
    ],
    declarations: [
        CharacterMakerComponent,
        AddComponentComponent,
        SubComponent,
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
    exports: [
        CharacterMakerComponent
    ],
    entryComponents: [
        AddComponentComponent,
        FunctionDialogComponent
    ],
    providers: [
        CharacterMakerService,
        SubComponentService
    ]
})
export class CharacterMakerModule {

}
