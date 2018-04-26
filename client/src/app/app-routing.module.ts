import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CharacterMakerComponent } from './character-sheet/maker/character-maker.component';
import { RuleSetHomeComponent } from './rule-set/home/rule-set-home.component';
import { CharacterSheetComponent } from './character-sheet/sheet/character-sheet.component';
import { CampaignComponent } from './campaign/campaign.component';
import { EncounterComponent } from "./encounter/encounter.component";
import { BoardZoneComponent } from "./board/board-zone.component";

const routes: Routes = [
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'map-maker',
        component: BoardZoneComponent
    },
    {
        path: 'rule-set/:ruleSetId',
        component: RuleSetHomeComponent
    },
    {
        path: 'character-sheet/:characterSheetId',
        component: CharacterMakerComponent
    },
    {
        path: 'npc/:npcId',
        component: CharacterSheetComponent
    },
    {
        path: 'campaign/:campaignId',
        component: CampaignComponent
    },
    {
        path: 'encounter/:encounterId',
        component: EncounterComponent
    }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {
}
