import {Component, ComponentFactoryResolver, HostListener, OnInit, ViewChild, ViewContainerRef} from "@angular/core";
import {NpcPopComponent} from "./npcPop/npc-pop.component";
import {PopService} from "./pop.service";

@Component({
    selector: 'pop-root',
    templateUrl: 'pop-root.component.html',
    styleUrls: ['pop-root.component.css']
})

export class PopRootComponent implements OnInit{
    @ViewChild('popRoot', {read: ViewContainerRef}) popRoot;

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private popService: PopService
    ){}

    ngOnInit(): void {
        this.popService.connectPopContainer(this.popRoot);
    }
}
