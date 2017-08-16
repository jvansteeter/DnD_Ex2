import { Aspect, AspectType } from '../aspect';
import { AfterViewInit, Component, Input, OnInit, Renderer2, ViewChild } from "@angular/core";
import { SubComponentService } from "./sub-component.service";
import { TextComponent } from "./text.component";

@Component({
    selector: 'sub-component',
    templateUrl: 'sub-component.html',
    styleUrls: ['sub-component.css']
})
export class SubComponent implements OnInit, AfterViewInit{
    ngAfterViewInit(): void {
        console.log('this.child');
        console.log(this.child);
    }

    ngOnInit(): void {
        switch (this.aspect.aspectType) {
            case AspectType.text: {
                this.setDimensions(230, 120);
                break;
            }

            default: {
                throw new Error('Unknown aspect type');
            }
        }
    }

    @Input() aspect: Aspect;
    @ViewChild('child') child: TextComponent;
    aspectType = AspectType;
    width: number;
    height: number;
    minHeight: number;
    minWidth: number;
    value: any;

    private dragging: boolean = false;

    constructor(renderer: Renderer2, private subComponentService: SubComponentService) {
        renderer.listen('document', 'mousemove', (event) => {
            if (this.dragging) {
                if (this.width + event.movementX > this.minWidth &&
                    this.width + event.movementX < this.getMaxWidth()) {
                    this.width += event.movementX;
                }
                if (this.height + event.movementY > this.minHeight) {
                    this.height += event.movementY;
                }
                this.subComponentService.emit('resize', {width: this.width, height: this.height});
            }
        });

        renderer.listen('document', 'mouseup', () => {
            this.dragging = false;
        });
    }

    setDimensions(width: number, height: number) {
        this.width = width;
        this.minWidth = width;
        this.height = height;
        this.minHeight = height;
    }

    startDrag(): void {
        this.dragging = true;
    }

    private getMaxWidth(): number {
        return window.innerWidth - 100;
    }
}