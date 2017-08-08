import { NgModule } from '@angular/core';
import { LoginComponent } from './login.component';
import { FormsModule } from '@angular/forms';
import { LoginService } from './login.service';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { MdButtonModule, MdDialogModule, MdInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RegisterDialogComponent } from './registerDialog.component';
import { ErrorEmitterService } from './ErrorEmitter.service';


@NgModule({
    imports: [
        FormsModule,
        BrowserModule,
        HttpModule,
        MdDialogModule,
        BrowserAnimationsModule,
        MdButtonModule,
        MdInputModule
    ],
    declarations: [
        LoginComponent,
        RegisterDialogComponent
    ],
    providers: [
        LoginService,
        ErrorEmitterService
    ],
    entryComponents: [
        RegisterDialogComponent
    ],
    bootstrap: [ LoginComponent ]
})
export class LoginModule {
}