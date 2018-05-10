import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { NavigationEnd, Router } from '@angular/router';
import 'rxjs-compat/add/operator/filter';
import { SideNavOption } from '../utilities/router-component/sideNav-option';
import { MainNavService } from './main-nav.service';
import { HomeComponent } from '../home/home.component';
import { RouterComponent } from '../utilities/router-component/router-component';
import { Observable } from 'rxjs';
import 'rxjs-compat/add/operator/merge';
import 'rxjs-compat/add/operator/mergeMap';
import 'rxjs-compat/add/operator/do';
import { CampaignComponent } from '../campaign/campaign.component';

@Component({
    selector: 'main-nav',
    templateUrl: './main-nav.component.html',
    styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent implements OnInit {
    isHandset: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.Handset);
    sideNavOptions: SideNavOption[];

    constructor(private breakpointObserver: BreakpointObserver,
                private router: Router,
                private mainNavService: MainNavService) {}

    ngOnInit(): void {
        this.mainNavService.getComponentRegisteredObservable()
            .merge(this.router.events.filter((routerEvent) => routerEvent instanceof NavigationEnd))
            .map(() => {
                return this.router.url;
            })
            .subscribe((url) => {
                this.sideNavOptions = [];
                if (url.indexOf('home') >= 0){
                    this.initSideNavOptions(HomeComponent.name);
                }
                else if (url.indexOf('campaign') >= 0) {
                    this.initSideNavOptions(CampaignComponent.name);
                }
            });
    }

    private initSideNavOptions(componentName: string): void {
        let component: RouterComponent = this.mainNavService.getRouterComponent(componentName);
        if (component) {
            this.sideNavOptions = component.sideNavOptions;
        }
    }
}
