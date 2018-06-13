import {ComponentFactoryResolver, ComponentRef, Injectable, ViewContainerRef} from "@angular/core";
import {NpcPopComponent} from "./npcPop/npc-pop.component";
import {Player} from "../../encounter/player";

@Injectable()
export class PopService {
    popRoot: ViewContainerRef;
    playerPops: {id: number, ref: ComponentRef<NpcPopComponent>}[] = [];

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver
    ){}

    connectPopContainer(containerRef: ViewContainerRef) {
        this.popRoot = containerRef;
    }

    addPlayerPop(x: number, y: number, player: Player) {
        let popFound = false;
        for (const pop of this.playerPops) {
            if (pop.id === player._id) {
                popFound = true;
            }
        }

        if (!popFound) {
            const componentFactory = this.componentFactoryResolver.resolveComponentFactory(NpcPopComponent);
            const componentRef = this.popRoot.createComponent(componentFactory);

            const componentInst = (<NpcPopComponent>componentRef.instance);
            componentInst.initVars(this, false, x, y, player);
            this.playerPops.push({id: player._id, ref: componentRef});
        }
    }

    clearPlayerPop(id: number) {
        let i;
        for (i = 0; i < this.playerPops.length; i++) {
            const pop = this.playerPops[i];

            if (pop.id === id) {
                pop.ref.destroy();
                this.playerPops.splice(i, 1);
            }
        }
    }

    popIsActive(id: number) {
        for (const pop of this.playerPops) {
            if (pop.id === id) {
                return true;
            }
        }
        return false;
    }
}
