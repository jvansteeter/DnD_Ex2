import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import 'rxjs-compat/add/operator/filter';

@Component({
  selector: 'main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent implements OnInit {
  isHandset: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.Handset);
  constructor(private breakpointObserver: BreakpointObserver,
              private router: Router) {}

  ngOnInit(): void {
    this.router.events.filter((routerEvent) => routerEvent instanceof NavigationEnd).subscribe((event) => {
      event = event as NavigationEnd;

      console.log(event);
    });
  }
}
