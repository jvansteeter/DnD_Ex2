import {ComponentFactoryResolver, Injectable, ViewContainerRef} from "@angular/core";
import {NpcPopComponent} from "./npcPop/npc-pop.component";

@Injectable()
export class PopService {
    popRoot: ViewContainerRef;

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver
    ){}

    connectPopContainer(containerRef: ViewContainerRef) {
        this.popRoot = containerRef;
    }

    addPlayerPop(x: number, y: number, data) {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(NpcPopComponent);
        const componentRef = this.popRoot.createComponent(componentFactory);

        const componentInst = (<NpcPopComponent>componentRef.instance);
        componentInst.initVars(x, y, data);
    }

    clearPops() {
        this.popRoot.clear();
    }
}
