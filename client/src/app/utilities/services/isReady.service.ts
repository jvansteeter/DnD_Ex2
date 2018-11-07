import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { of } from "rxjs/internal/observable/of";
import { merge } from 'rxjs/internal/observable/merge';
import { map } from 'rxjs/operators';

export abstract class IsReadyService {
	private readonly isReadySubject: BehaviorSubject<boolean>;
	private readonly dependencies: IsReadyService[];
	protected dependenciesSub: Subscription;

	protected constructor(...dependencies: IsReadyService[]) {
		this.isReadySubject = new BehaviorSubject<boolean>(false);
		this.dependencies = dependencies;
	}

	public abstract init(): void;

	public unInit(): void {
		this.setReady(false);
	}

	public isReady(): boolean {
		return this.isReadySubject.getValue();
	}

	get isReadyObservable(): Observable<boolean> {
		return this.isReadySubject.asObservable();
	}

	protected setReady(ready: boolean): void {
		if (ready && this.dependenciesSub) {
			this.dependenciesSub.unsubscribe();
		}
		this.isReadySubject.next(ready);
	}

	protected dependenciesReady(): Observable<boolean> {
		let dependencyObservables: Observable<boolean>[] = this.dependencies.map((dep) => {
			return dep.isReadyObservable;
		});
		if (dependencyObservables.length === 0) {
			return of(true);
		}
		else if (dependencyObservables.length === 1) {
			return dependencyObservables[0];
		}
		return merge(...dependencyObservables).pipe(
				map(() => {
					let ready = true;
					for (let dependency of this.dependencies) {
						ready = ready && dependency.isReady();
					}

					return ready;
				})
		);
	}
}
