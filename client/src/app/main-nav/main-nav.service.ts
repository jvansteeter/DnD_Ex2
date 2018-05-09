import { Injectable } from '@angular/core';
import { RouterComponent } from '../utilities/router-component/router-component';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MainNavService {
    private routerComponents: Map<string, RouterComponent>;
    private componentRegisteredSubject: Subject<void>;

    constructor() {
        this.routerComponents = new Map<string, RouterComponent>();
        this.componentRegisteredSubject = new Subject<void>();
    }

    public registerRouterComponent(component: RouterComponent): void {
        this.routerComponents.set(component.constructor.name, component);
        this.componentRegisteredSubject.next();
    }

    public getRouterComponent(componentName: string): RouterComponent {
        return this.routerComponents.get(componentName);
    }

    public getComponentRegisteredObservable(): Observable<void> {
        return this.componentRegisteredSubject.asObservable();
    }
}