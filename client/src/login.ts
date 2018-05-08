import 'reflect-metadata';
import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";
import { enableProdMode } from '@angular/core';
import {LoginModule} from "./login/login.module";

if (process.env.ENV === 'production') {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(LoginModule);
