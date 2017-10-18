import { Component, Pipe, PipeTransform } from '@angular/core';
import { FunctionGrammar, GrammarNode } from './function.grammar';
import { CharacterMakerService } from '../../character-maker.service';
import { AspectType } from '../../aspect';
import { MatDialogRef } from '@angular/material';

@Component({
    templateUrl: 'function-dialog.component.html',
    styleUrls: ['../sub-component.css']
})
export class FunctionDialogComponent {
    next: GrammarNode[];
    grammarNode = GrammarNode;
    aspectType = AspectType;

    _function: FunctionGrammar;

    currentListOptions = [];

    constructor(private dialogRef: MatDialogRef<FunctionDialogComponent>, private characterMakerService: CharacterMakerService) {
        this._function = new FunctionGrammar(characterMakerService);
        this._function.start();
        this.next = this._function.nextOptions();
    }

    addNode(node: GrammarNode): void {
        this._function.push(node);
        let currentNode = this._function.currentNode();
        if (currentNode === GrammarNode.START ||
            currentNode === GrammarNode.IF ||
            currentNode === GrammarNode.THEN ||
            currentNode === GrammarNode.THIS ||
            currentNode === GrammarNode.ASSIGNED ||
            currentNode === GrammarNode.IF_NOT) {
            this.next = this._function.nextOptions();
        }
        else if (currentNode === GrammarNode.DONE) {
            this.finishFunction();
        }
        else {
            this.next = [];
        }
    }

    removeLast(): void {
        let last = this._function.pop();
        if (last === GrammarNode.ASPECT_BOOLEAN ||
            last === GrammarNode.ASPECT_NUMBER ||
            last === GrammarNode.ASSIGNED_ASPECT_NUMBER ||
            last === GrammarNode.ASSIGNED_ASPECT_BOOLEAN) {
            this._function.pop();
        }
        else if (last === GrammarNode.ASPECT_BOOLEAN_LIST_ITEM) {
            this._function.pop();
            this._function.pop();
        }
        this.next = this._function.nextOptions();
    }

    selectOption(selected): void {
        console.log('selected')
        console.log(selected)
        let currentNode = this._function.currentNode();
        if (currentNode === GrammarNode.ASPECT) {
            if (selected.aspectType === AspectType.BOOLEAN && this._function.previousNode() === GrammarNode.IF) {
                this._function.push(GrammarNode.ASPECT_BOOLEAN);
            }
            else if (selected.aspectType === AspectType.BOOLEAN && this._function.previousNode() === GrammarNode.ASSIGNED) {
                this._function.push(GrammarNode.ASSIGNED_ASPECT_BOOLEAN);
            }
            else if (selected.aspectType === AspectType.NUMBER && this._function.previousNode() === GrammarNode.IF) {
                this._function.push(GrammarNode.ASPECT_NUMBER);
            }
            else if (selected.aspectType === AspectType.NUMBER && this._function.previousNode() === GrammarNode.ASSIGNED) {
                this._function.push(GrammarNode.ASSIGNED_ASPECT_NUMBER_FIRST);
            }
            else if (selected.aspectType === AspectType.BOOLEAN_LIST && this._function.previousNode() === GrammarNode.IF) {
                this._function.push(GrammarNode.ASPECT_BOOLEAN_LIST);
                this._function.setCurrentValue(selected);
                this.currentListOptions = this.characterMakerService.valueOfAspect(selected);
                this._function.push(GrammarNode.ASPECT_BOOLEAN_LIST_ITEM);
            }
            else if (selected.aspectType === AspectType.CATEGORICAL && this._function.previousNode() === GrammarNode.IF) {
                this._function.push(GrammarNode.ASPECT_CATEGORY);
                let categories = this.characterMakerService.getAspectOptions(selected);
                this.currentListOptions = [];
                for (let i = 0; i < categories.length; i++) {
                    this.currentListOptions.push(<never>categories[i]);
                }
            }
        }
        if (currentNode === GrammarNode.LOGIC_OPERATOR) {
            this._function.setCurrentValue(selected.value);
        }
        else {
            this._function.setCurrentValue(selected);
        }
        if (selected.aspectType !== AspectType.BOOLEAN_LIST) {
            this.next = this._function.nextOptions();
        }
    }

    private finishFunction(): void {
        this.dialogRef.close(this._function);
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
