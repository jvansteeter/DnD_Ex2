import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort } from '@angular/material';
import { BehaviorSubject, merge, Subject } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';

export class SubjectDataSource<T> extends DataSource<T> {
  private dataSubject: Subject<T[]>;
  public data: T[];
  public filter: string;

  constructor(subject: Subject<T[]>,
              private paginator?: MatPaginator,
              private sort?: MatSort) {
    super();
    this.dataSubject = subject;
  }

  connect(): Observable<T[]> {
    let updateSubject: BehaviorSubject<T[]>;
    let dataMutations: any[] = [];
    return this.dataSubject.asObservable().pipe(
        tap((data: T[]) => {
          this.data = data;
          updateSubject = new BehaviorSubject<T[]>(data);

          dataMutations.push(updateSubject.asObservable());
          if (this.paginator) {
            dataMutations.push(this.paginator.page);
          }
          if (this.sort) {
            dataMutations.push(this.sort.sortChange);
          }
        }),
        mergeMap(() => {
          return merge(...dataMutations).pipe(map(() => {
            return this.getPagedData(this.getSortedData([ ...this.data ]));
          }));
        })
    );
  }

  disconnect(): void {
  }

  setPaginatorLength(length: number): void {
    if (!this.paginator) {
      return;
    }

    this.paginator.length = length;
  }

  private getPagedData(data: T[]) {
    if (!this.paginator) {
      return data;
    }
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  private getSortedData(data: T[]) {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
          // case 'name': return compare(a.name, b.name, isAsc);
          // case 'id': return compare(+a.id, +b.id, isAsc);
        default:
          return 0;
      }
    });
  }
}

function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
