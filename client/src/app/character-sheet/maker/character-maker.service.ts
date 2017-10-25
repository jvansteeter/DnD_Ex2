import { Injectable } from '@angular/core';
import { Aspect, AspectType } from '../shared/aspect';
import { SubComponent } from '../shared/subcomponents/sub-component';
import { CategoryComponent } from '../shared/subcomponents/category/category.component';
import { HttpClient } from '@angular/common/http';
import { CheckboxListComponent } from '../shared/subcomponents/checkbox-list/checkbox-list.component';
import { FunctionComponent } from '../shared/subcomponents/function/function.component';
import { SubComponentChild } from '../shared/subcomponents/sub-component-child';
import { CharacterInterfaceService } from '../shared/character-interface.service';


@Injectable()
export class CharacterMakerService implements CharacterInterfaceService {
    private characterSheetId: string;

    private characterSheetWidth: number = 0;
    private characterSheetHeight: number = 0;
    public subComponents: SubComponent[];

    public aspects: Aspect[];

    private currentHover: Aspect;

    constructor(private http: HttpClient) {
        this.init();
    }

    public init(): void {
        this.aspects = [];
        this.subComponents = [];
        delete this.currentHover;
    }

    public addComponent(aspect: any): void {
        this.aspects.push(aspect);
    }


    public removeComponent(aspect: any): void {
        let index = this.aspects.indexOf(aspect);
        this.aspects.splice(index, 1);
        this.subComponents.splice(index, 1);
    }

    public setWidth(width: number): void {
        this.characterSheetWidth = width;
    }

    public registerSubComponent(subComponent: SubComponent): void {
        this.subComponents.push(subComponent);
    }

    public getAspectsOfType(type?: AspectType ): Aspect[] {
        if (!type) {
            return this.aspects;
        }
        let result: Aspect[] = [];
        for (let i = 0; i < this.aspects.length; i++) {
            if (this.aspects[i].aspectType === type) {
                result.push(this.aspects[i]);
            }
        }

        return result;
    }

    public valueOfAspect(aspect: Aspect): any {
        for (let i = 0; i < this.subComponents.length; i++) {
            let subComponent = this.subComponents[i];
            if (subComponent.aspect.label === aspect.label) {
                return subComponent.getValue();
            }
        }

        return null;
    }

    public updateFunctionAspects(): void {
        this.subComponents.forEach(subComponent => {
            if (subComponent.aspect.aspectType === AspectType.FUNCTION) {
                subComponent.getValue();
            }
        })
    }

    public getAspectOptions(aspect: Aspect): any {
        for (let i = 0; i < this.subComponents.length; i++) {
            let subComponent = this.subComponents[i];
            if (subComponent.aspect === aspect && aspect.aspectType === AspectType.CATEGORICAL) {
                return (<CategoryComponent>subComponent.child).getCategories();
            }
        }

        return null;
    }

    public save() {
        let characterSheet = {
            _id: this.characterSheetId,
            height: this.characterSheetHeight
        };
        let aspects: any[] = [];
        for (let i = 0; i < this.aspects.length; i++) {
            let aspect = this.aspects[i];
            let aspectObj = {
                label: aspect.label,
                aspectType: aspect.aspectType,
                required: aspect.required,
                config: aspect.config
            };
            if (aspect.aspectType === AspectType.CATEGORICAL) {
                aspectObj['items'] = (<CategoryComponent>this.getChildOf(aspect)).getCategories();
            }
            else if (aspect.aspectType === AspectType.BOOLEAN_LIST) {
                aspectObj['items'] = (<CheckboxListComponent>this.getChildOf(aspect)).getCheckboxLabels();
            }
            else if (aspect.aspectType === AspectType.FUNCTION) {
                aspectObj['functionGrammar'] = (<FunctionComponent>this.getChildOf(aspect)).getFunction();
            }
            aspects.push(aspectObj);
        }
        characterSheet['aspects'] = aspects;
        this.http.post('/api/ruleset/charactersheet/save', characterSheet, {responseType: 'text'}).subscribe();
    }

    private getChildOf(aspect: Aspect): SubComponentChild | undefined {
        for (let i = 0; i < this.subComponents.length; i++) {
            if (this.subComponents[i].aspect === aspect) {
                return this.subComponents[i].child;
            }
        }

        return undefined;
    }

    public setCharacterSheetId(id: string): void {
        this.characterSheetId = id;
    }

    public initAspects(aspects: any[]): void {
        this.aspects = [];
        aspects.forEach(aspectObj => {
            let aspect = new Aspect(aspectObj.label, aspectObj.aspectType, aspectObj.required);
            aspect.isNew = false;
            if (!!aspectObj.config) {
                aspect.config = aspectObj.config;
            }
            if (aspectObj.hasOwnProperty('items')) {
                aspect.items = aspectObj.items;
            }
            if (!!aspectObj.ruleFunction) {
                aspect.ruleFunction = aspectObj.ruleFunction;
            }

            this.aspects.push(aspect);
        });
    }

    public setHover(aspect: Aspect): void {
        this.currentHover = aspect;
    }
}