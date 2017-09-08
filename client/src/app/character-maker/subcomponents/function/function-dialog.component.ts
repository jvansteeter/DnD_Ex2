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
    next: GrammarNode[];
    grammarNode = GrammarNode;
    aspectType = AspectType;
    currentNodeValue: any;

    functionStack = new FunctionGrammar();

    private lastAspect: Aspect | null;

    // private isEqual: boolean = true;
    // private isNotEqual: boolean = true;
    // private isLessThan: boolean = true;
    // private isGreaterThan: boolean = true;
    // private isLessThanOrEqualTo: boolean = true;
    // private isGreaterThanOrEqualTo: boolean = true;

    constructor(private dialogRef: MdDialogRef<FunctionDialogComponent>, private characterMakerService: CharacterMakerService) {
        this.functionStack.start();
        this.next = this.functionStack.nextOptions();
    }

    addNode(node): void {
        this.functionStack.push(node);
        this.currentNodeValue = null;
        let currentNode = this.functionStack.currentNode();
        if (currentNode !== GrammarNode.ASPECT) {
            this.next = this.functionStack.nextOptions();
        }
        else {
            this.next = [];
        }
    }

    removeLast(): void {
        this.functionStack.pop();
        this.next = this.functionStack.nextOptions();
    }

    selectOption(selected): void {
        this.currentNodeValue = selected.value;
        let currentNode = this.functionStack.currentNode();
        switch (currentNode) {
            case GrammarNode.ASPECT: {
                if (this.currentNodeValue.aspectType === AspectType.BOOLEAN) {
                    this.functionStack.pop();
                    this.functionStack.push(GrammarNode.ASPECT_BOOLEAN);
                    this.next = this.functionStack.nextOptions();
                }
                else if (this.currentNodeValue.aspectType === AspectType.NUMBER) {
                    this.functionStack.pop();
                    this.functionStack.push(GrammarNode.ASPECT_NUMBER);
                    this.next = this.functionStack.nextOptions();
                }


                // if (this.currentNodeValue.aspectType === AspectType.BOOLEAN) {
                //     if (this.lastAspect) {
                //         this.lastAspect = null;
                //         this.next = [GrammarNode.THEN];
                //         return;
                //     }
                //     this.isEqual = true;
                //     this.isNotEqual = true;
                //     this.isLessThan = false;
                //     this.isGreaterThan = false;
                //     this.isLessThanOrEqualTo = false;
                //     this.isGreaterThanOrEqualTo = false;
                //
                //     this.next = [GrammarNode.LOGIC_OPERATOR];
                //     this.lastAspect = this.currentNodeValue;
                // }
                // else if (this.currentNodeValue.aspectType === AspectType.NUMBER) {
                //     this.next = [GrammarNode.OPERATOR, GrammarNode.LOGIC_OPERATOR];
                // }
                break;
            }
            case GrammarNode.LOGIC_OPERATOR: {
                if (this.functionStack.previousNode() === GrammarNode.ASPECT && (<Aspect>this.lastAspect).aspectType === AspectType.BOOLEAN) {
                    this.next = [GrammarNode.ASPECT, GrammarNode.BOOLEAN];
                }
                if (this.functionStack.previousNode() === GrammarNode.ASPECT && (<Aspect>this.lastAspect).aspectType === AspectType.NUMBER) {
                    this.next = [GrammarNode.ASPECT, GrammarNode.NUMBER];
                }
                break;
            }
        }
    }
}