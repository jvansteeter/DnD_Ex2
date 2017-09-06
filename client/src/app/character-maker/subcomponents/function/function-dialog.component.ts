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
    soFar: GrammarNode[] = [];
    next: GrammarNode[];
    grammarNode = GrammarNode;
    aspectType = AspectType;

    graph = new FunctionGrammar();


    constructor(private dialogRef: MdDialogRef<FunctionDialogComponent>, private characterMakerService: CharacterMakerService) {
        this.soFar.push(GrammarNode.START);
        this.next = this.graph.grammar[GrammarNode.START];
    }

    addNode(node): void {
        this.soFar.push(node);
        this.next = this.graph.grammar[node];
    }

    removeLast(): void {
        this.soFar.pop();
        this.next = this.graph.grammar[this.soFar[this.soFar.length - 1]];
    }
}