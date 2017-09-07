import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { FunctionGrammar, GrammarNode } from './function.grammar';
import { CharacterMakerService } from '../../character-maker.service';
import { Aspect, AspectType } from '../../aspect';

@Component({
    templateUrl: 'function-dialog.component.html',
    styleUrls: ['../sub-component.css']
})
export class FunctionDialogComponent {
    functionList: GrammarNode[] = [];
    next: GrammarNode[];
    grammarNode = GrammarNode;
    aspectType = AspectType;
    currentNodeValue: any;

    graph = new FunctionGrammar();


    constructor(private dialogRef: MdDialogRef<FunctionDialogComponent>, private characterMakerService: CharacterMakerService) {
        this.functionList.push(GrammarNode.START);
        this.next = this.graph.grammar[GrammarNode.START];
    }

    addNode(node): void {
        this.functionList.push(node);
        this.currentNodeValue = null;
        let currentNode = this.functionList[this.functionList.length - 1];
        if (currentNode === GrammarNode.START ||
            currentNode === GrammarNode.IF ||
            currentNode === GrammarNode.THEN ||
            currentNode === GrammarNode.THIS ||
            currentNode === GrammarNode.ASSIGNED) {
            this.next = this.graph.grammar[node];
        }
        else {
            this.next = [];
        }
    }

    removeLast(): void {
        this.functionList.pop();
        this.next = this.graph.grammar[this.functionList[this.functionList.length - 1]];
        // console.log(this.currentNode);
    }

    selectOption(selected): void {
        this.currentNodeValue = selected.value;
        let currentNode = this.functionList[this.functionList.length - 1];
        console.log(selected);
        switch (currentNode) {
            case (GrammarNode.ASPECT): {
                let currentAspect = this.characterMakerService.getAspectWithLabel(this.currentNodeValue);
                console.log(currentAspect)
                if (currentAspect === undefined) {
                    return;
                }
                if (currentAspect.aspectType === AspectType.NUMBER) {
                    this.next = [GrammarNode.OPERATOR, GrammarNode.LOGIC_OPERATOR]
                }
                break;
            }
        }
    }
}