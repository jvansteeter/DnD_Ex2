import 'reflect-metadata';
import { AppModule } from './app/app.module';
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { enableProdMode } from "@angular/core";
import 'hammerjs/hammer';

enableProdMode();

platformBrowserDynamic().bootstrapModule(AppModule);
