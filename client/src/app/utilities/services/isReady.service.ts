import { BehaviorSubject, Observable } from 'rxjs';
import { forkJoin } from "rxjs";
import { map, mergeAll } from "rxjs/operators";
import { of } from "rxjs/internal/observable/of";

export abstract class IsReadyService {
	private isReadySubject: BehaviorSubject<boolean>;
	private dependencies: IsReadyService[];

	protected constructor(... dependencies: IsReadyService[]) {
		this.isReadySubject = new BehaviorSubject<boolean>(false);
		this.dependencies = dependencies;
	}

	public abstract init(): void;

	public isReady(): Observable<boolean> {
		return this.isReadySubject.asObservable();
	}

	protected setReady(ready: boolean): void {
		this.isReadySubject.next(ready);
	}

	protected dependenciesReady(): Observable<boolean> {
		let dependencyObservables: Observable<boolean>[] = this.dependencies.map((dep) => {
			return dep.isReady();
		});
		if (dependencyObservables.length === 0) {
			return of(true);
		}
		else if (dependencyObservables.length === 1) {
			return dependencyObservables[0];
		}
		return forkJoin(dependencyObservables)
				.pipe(map((isReadies: boolean[]) => {
			let isReady = true;
			isReadies.forEach((ready: boolean) => {
				isReady = isReady && ready;
			});
			return isReady;
		}));
	}
}