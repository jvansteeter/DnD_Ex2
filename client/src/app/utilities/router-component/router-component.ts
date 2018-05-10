import { MainNavService } from '../../main-nav/main-nav.service';
import { SideNavOption } from './sideNav-option';

export abstract class RouterComponent {
    public sideNavOptions: SideNavOption[];

    protected constructor(private mainNavService: MainNavService) {

    }

    protected registerRouterComponent(): void {
        this.mainNavService.registerRouterComponent(this);
    }
}