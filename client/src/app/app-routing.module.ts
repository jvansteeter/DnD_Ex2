import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MapMakerComponent } from './map-maker/map-maker.component';
import { CharacterMakerComponent } from './character-maker/character-maker.component';
import { RuleSetHomeComponent } from './rule-set-home/rule-set-home.component';

const routes: Routes = [
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'map-maker',
        component: MapMakerComponent
    },
    {
        path: 'character-maker',
        component: CharacterMakerComponent
    },
    {
        path: 'rule-set/:ruleSetId',
        component: RuleSetHomeComponent
    },
    {
        path: 'character-sheet/:characterSheetId',
        component: CharacterMakerComponent
    }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {
}
