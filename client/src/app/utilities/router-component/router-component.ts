import { MainNavService } from '../../main-nav/main-nav.service';
import { SideNavOption } from './sideNav-option';

export class RouterComponent {
    public sideNavOptions: SideNavOption[];

    constructor(private mainNavService: MainNavService) {

    }

    protected registerRouterComponent(): void {
        this.mainNavService.registerRouterComponent(this);
    }
}