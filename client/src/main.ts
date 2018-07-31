import 'reflect-metadata';
import 'hammerjs';
import { AppModule } from './app/app.module';
import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";
import {enableProdMode} from "@angular/core";
import 'hammerjs/hammer';

if (process.env.ENV === 'production') {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
