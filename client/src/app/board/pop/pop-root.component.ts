import {Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef} from "@angular/core";
import {PopService} from "./pop.service";

@Component({
    selector: 'pop-root',
    templateUrl: 'pop-root.component.html',
    styleUrls: ['pop-root.component.css']
})

export class PopRootComponent implements OnInit{
    @ViewChild('popRoot', {read: ViewContainerRef, static: true}) popRoot;

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private popService: PopService
    ){}

    ngOnInit(): void {
        this.popService.connectPopContainer(this.popRoot);
    }
}
