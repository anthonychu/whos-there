import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subscription, timer } from 'rxjs';
import { catchError } from 'rxjs/operators';

export class ActiveName {
  name: string;
  stale: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PingService {
  private pageViewersSubject: BehaviorSubject<ActiveName[]>;
  pageViewers$: Observable<ActiveName[]>;

  private pingUrl: string = '/api/ping';

  private viewerNamePrivate: string = '';

  private subscription: Subscription;

  constructor(private http: HttpClient) {
    this.pageViewersSubject = new BehaviorSubject<ActiveName[]>([{name: 'Loading...', stale: false }]);
    this.pageViewers$ = this.pageViewersSubject.asObservable();

    this.subscription = timer(0, 5000).subscribe(result => {
      this.updatePageViewers();
    });
   }

   get pageViewers(): ActiveName[] {
     return this.pageViewersSubject.getValue();
   }

   get viewerName(): string {
     return this.viewerNamePrivate;
   }

   set viewerName(viewerName: string) {
     this.viewerNamePrivate = viewerName;
   }

   private updatePageViewers(): void {
    if (this.viewerName) {
      const pingWithName = this.pingUrl + '?name=' + this.viewerName;
      this.http.post(pingWithName, null).pipe(catchError(error => of([])))
      .subscribe((pageViewers: ActiveName[]) => {
        this.pageViewersSubject.next(pageViewers);
      });
    } else {
      this.http.get(this.pingUrl).pipe(catchError(error => of([])))
        .subscribe((pageViewers: ActiveName[]) => {
          this.pageViewersSubject.next(pageViewers);
        });
    }
   }
}
