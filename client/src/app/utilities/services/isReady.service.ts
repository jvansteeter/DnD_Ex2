import { BehaviorSubject, Observable } from 'rxjs';
import { of } from "rxjs/internal/observable/of";
import { merge } from 'rxjs/internal/observable/merge';
import { map } from 'rxjs/operators';

export abstract class IsReadyService {
	private readonly isReadySubject: BehaviorSubject<boolean>;
	private readonly dependencies: IsReadyService[];

	protected constructor(...dependencies: IsReadyService[]) {
		this.isReadySubject = new BehaviorSubject<boolean>(false);
		this.dependencies = dependencies;
	}

	public abstract init(): void;

	public unInit(): void {
		this.setReady(false);
	}

	public isReady(): BehaviorSubject<boolean> {
		return this.isReadySubject;
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
		return merge(...dependencyObservables).pipe(
				map(() => {
					let ready = true;
					for (let dependency of this.dependencies) {
						ready = ready && dependency.isReady().getValue();
					}

					return ready;
				})
		);
	}
}
