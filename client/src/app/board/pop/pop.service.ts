import {ComponentFactoryResolver, ComponentRef, Injectable, ViewContainerRef} from "@angular/core";
import {NpcPopComponent} from "./npcPop/npc-pop.component";
import {Player} from "../../encounter/player";

@Injectable()
export class PopService {
    popRoot: ViewContainerRef;
    persistPops: {id: number, ref: ComponentRef<NpcPopComponent>}[] = [];

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver
    ){}

    connectPopContainer(containerRef: ViewContainerRef) {
        this.popRoot = containerRef;
    }

    addPlayerPop(x: number, y: number, player: Player) {
        let popFound = false;
        for (const pop of this.persistPops) {
            if (pop.id === player.id) {
                popFound = true;
            }
        }

        if (!popFound) {
            const componentFactory = this.componentFactoryResolver.resolveComponentFactory(NpcPopComponent);
            const componentRef = this.popRoot.createComponent(componentFactory);

            const componentInst = (<NpcPopComponent>componentRef.instance);
            componentInst.initVars(this, false, x, y, player);
            this.persistPops.push({id: player.id, ref: componentRef});
        }
    }

    clearPop(id: number) {
        let i;
        for (i = 0; i < this.persistPops.length; i++) {
            const pop = this.persistPops[i];

            if (pop.id === id) {
                pop.ref.destroy();
                this.persistPops.splice(i, 1);
            }
        }
    }
}
