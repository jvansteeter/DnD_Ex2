import { NgModule } from '@angular/core';
import { AlertComponent } from './alert.component';
import { AlertService } from './alert.service';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';


@NgModule({
    imports: [
        FormsModule,
        BrowserModule
    ],
    declarations: [
        AlertComponent
    ],
    exports: [
        AlertComponent
    ],
    providers: [
        AlertService
    ]
})
export class AlertModule {

}