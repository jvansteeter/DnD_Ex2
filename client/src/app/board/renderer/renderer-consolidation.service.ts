import { Injectable } from '@angular/core';
import { RendererComponent } from './render-component.interface';

@Injectable()
export class RendererConsolidationService {
	private frameId: number;
	private renderers: Map<string, RendererComponent>;

	constructor() {
		this.renderers = new Map();
	}

	public start(): void {
		this.render();
	}

	public stop(): void {
		cancelAnimationFrame(this.frameId);
	}

	public registerRenderer(renderer: RendererComponent): void {
		this.renderers.set(renderer.constructor.name, renderer);
	}

	public deregisterRenderer(renderer: RendererComponent): void {
		this.renderers.delete(renderer.constructor.name);
	}

	private render = () => {
		[...this.renderers.values()].forEach((renderer: RendererComponent) => {
			renderer.render();
		});

		setTimeout(() => {
			this.frameId = requestAnimationFrame(this.render);
		}, 100);
	}
}