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
                private mainNavService: MainNavService,
                private activatedRoute: ActivatedRoute) {}

    ngOnInit(): void {

        // merge(this.mainNavService.getComponentRegisteredObservable(), this.router.events.filter((routerEvent) => routerEvent instanceof NavigationEnd))
        this.mainNavService.getComponentRegisteredObservable()
            .merge(this.router.events.filter((routerEvent) => routerEvent instanceof NavigationEnd))
            .flatMap(() => {
                return this.activatedRoute.component.toString();
            })
            .subscribe((url) => {

                // const url = event.url;
                // if (url.path.match(/.*home.*/)){
                //     let component: RouterComponent = this.mainNavService.getRouterComponent('HomeComponent');
                //     if (component) {
                //         this.sideNavOptions = component.sideNavOptions;
                //     }
                // }
                console.log(url);
            });
    }
}
