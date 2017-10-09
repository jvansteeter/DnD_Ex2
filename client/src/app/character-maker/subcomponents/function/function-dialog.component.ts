import { Component, Pipe, PipeTransform } from '@angular/core';
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

    functionStack: FunctionGrammar;

    currentListOptions = [];

    constructor(private dialogRef: MdDialogRef<FunctionDialogComponent>, private characterMakerService: CharacterMakerService) {
        this.functionStack = new FunctionGrammar(characterMakerService);
        this.functionStack.start();
        this.next = this.functionStack.nextOptions();
    }

    addNode(node: GrammarNode): void {
        this.functionStack.push(node);
        let currentNode = this.functionStack.currentNode();
        if (currentNode === GrammarNode.START ||
            currentNode === GrammarNode.IF ||
            currentNode === GrammarNode.THEN ||
            currentNode === GrammarNode.THIS ||
            currentNode === GrammarNode.ASSIGNED ||
            currentNode === GrammarNode.IF_NOT) {
            this.next = this.functionStack.nextOptions();
        }
        else if (currentNode === GrammarNode.DONE) {
            this.finishFunction();
        }
        else {
            this.next = [];
        }
    }

    removeLast(): void {
        let last = this.functionStack.pop();
        if (last === GrammarNode.ASPECT_BOOLEAN ||
            last === GrammarNode.ASPECT_NUMBER ||
            last === GrammarNode.ASSIGNED_ASPECT_NUMBER ||
            last === GrammarNode.ASSIGNED_ASPECT_BOOLEAN) {
            this.functionStack.pop();
        }
        else if (last === GrammarNode.ASPECT_BOOLEAN_LIST_ITEM) {
            this.functionStack.pop();
            this.functionStack.pop();
        }
        this.next = this.functionStack.nextOptions();
    }

    selectOption(selected): void {
        console.log('selected')
        console.log(selected)
        let currentNode = this.functionStack.currentNode();
        if (currentNode === GrammarNode.ASPECT) {
            if (selected.aspectType === AspectType.BOOLEAN && this.functionStack.previousNode() === GrammarNode.IF) {
                this.functionStack.push(GrammarNode.ASPECT_BOOLEAN);
            }
            else if (selected.aspectType === AspectType.BOOLEAN && this.functionStack.previousNode() === GrammarNode.ASSIGNED) {
                this.functionStack.push(GrammarNode.ASSIGNED_ASPECT_BOOLEAN);
            }
            else if (selected.aspectType === AspectType.NUMBER && this.functionStack.previousNode() === GrammarNode.IF) {
                this.functionStack.push(GrammarNode.ASPECT_NUMBER);
            }
            else if (selected.aspectType === AspectType.NUMBER && this.functionStack.previousNode() === GrammarNode.ASSIGNED) {
                this.functionStack.push(GrammarNode.ASSIGNED_ASPECT_NUMBER_FIRST);
            }
            else if (selected.aspectType === AspectType.BOOLEAN_LIST && this.functionStack.previousNode() === GrammarNode.IF) {
                this.functionStack.push(GrammarNode.ASPECT_BOOLEAN_LIST);
                this.functionStack.setCurrentValue(selected);
                this.currentListOptions = this.characterMakerService.valueOfAspect(selected);
                this.functionStack.push(GrammarNode.ASPECT_BOOLEAN_LIST_ITEM);
            }
            else if (selected.aspectType === AspectType.CATEGORICAL && this.functionStack.previousNode() === GrammarNode.IF) {
                this.functionStack.push(GrammarNode.ASPECT_CATEGORY);
                let categories = this.characterMakerService.getAspectOptions(selected);
                this.currentListOptions = [];
                for (let i = 0; i < categories.length; i++) {
                    this.currentListOptions.push(<never>categories[i]);
                }
            }
        }
        if (currentNode === GrammarNode.LOGIC_OPERATOR) {
            this.functionStack.setCurrentValue(selected.value);
        }
        else {
            this.functionStack.setCurrentValue(selected);
        }
        if (selected.aspectType !== AspectType.BOOLEAN_LIST) {
            this.next = this.functionStack.nextOptions();
        }
    }

    private finishFunction(): void {
        this.dialogRef.close(this.functionStack);
    }
}

@Pipe({
    name: 'nodePipe'
})
export class NodePipe implements PipeTransform {
    transform(value: any, ...args: any[]) {
        if (value === 'ASPECT_BOOLEAN' ||
            value === 'ASPECT_BOOLEAN_THEN' ||
            value === 'ASPECT_NUMBER' ||
            value === 'ASPECT_NUMBER_THEN') {
            value = 'ASPECT';
        }

        return value;
    }
}
