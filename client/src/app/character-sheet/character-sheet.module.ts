import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CharacterSheetComponent } from './character-sheet.component';
import { CharacterSheetRepository } from './character-sheet.repository';

@NgModule({
    imports: [
        HttpClientModule
    ],
    declarations: [
        CharacterSheetComponent
    ],
    providers: [
        CharacterSheetRepository
    ],
    exports: [
        CharacterSheetComponent
    ]
})
export class CharacterSheetModule {

}
