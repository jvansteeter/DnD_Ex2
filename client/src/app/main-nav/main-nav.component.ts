import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import 'rxjs-compat/add/operator/filter';
import { SideNavOption } from '../utilities/router-component/sideNav-option';
import { MainNavService } from './main-nav.service';
import { HomeComponent } from '../home/home.component';
import { RouterComponent } from '../utilities/router-component/router-component';
import { Observable } from 'rxjs';
import 'rxjs-compat/add/operator/merge';
import 'rxjs-compat/add/operator/mergeMap';
import 'rxjs-compat/add/operator/do';

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
                if (url.indexOf('home') >= 0){
                    let component: RouterComponent = this.mainNavService.getRouterComponent(HomeComponent.name);
                    if (component) {
                        this.sideNavOptions = component.sideNavOptions;
                    }
                }
            });
    }
}
