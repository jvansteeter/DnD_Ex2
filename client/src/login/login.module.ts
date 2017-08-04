import {NgModule} from "@angular/core";
import {LoginComponent} from "./login.component";
import {FormsModule} from "@angular/forms";
import {LoginService} from "./login.service";
import {HttpModule} from "@angular/http";
import {BrowserModule} from "@angular/platform-browser";
import { MdDialogModule } from '@angular/material';


@NgModule({
    imports: [
        FormsModule,
        BrowserModule,
        HttpModule,
        MdDialogModule
    ],
    declarations: [
        LoginComponent
    ],
    providers: [
        LoginService
    ],
    bootstrap: [LoginComponent]
})
export class LoginModule {}