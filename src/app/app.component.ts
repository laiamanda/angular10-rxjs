import { Component, DestroyRef, effect, inject, OnInit, signal, computed} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

import { interval, map, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  clickCount = signal(0);
  clickCount$ = toObservable(this.clickCount); //signals to observables

  interval$ = interval(1000);
  intervalSignal = toSignal(this.interval$, {initialValue: 0});

  customInterval$ = new Observable((subscriber) => {
    let timesExecuted = 0;
    const interval = setInterval(() => {
      // subscriber.error();
      if(timesExecuted > 3) {
        clearInterval(interval);
        subscriber.complete();
        return;
      }
      console.log('Emitting new value ...');
      subscriber.next({message: 'New Value'});
    }, 2000);
  });
  // interval = signal(0) // Observables values over time; Signals values in a container
  // doubleInterval = computed(() => this.interval() * 2);
  private destroyRef = inject(DestroyRef);

  constructor() {
    // effect(() => {
    //   console.log( `Click button ${this.clickCount()} times`);
    // });
    // toObservable(this.clickCount); // convert signal to observable
  }
  ngOnInit(): void {
    // setInterval(() => {
    //   this.interval.update(prevIntervalNumber => prevIntervalNumber + 1)
    // }, 1000);

    // const subscription = interval(1000).subscribe({
    //   next: (val) => console.log(val),
    //   // complete: () => {},
    //   // error: () =>  {},
    // });

    // const subscription = interval(1000).pipe(
    //   map((val) => val * 2 ),
    // ).subscribe({
    //   next: (val) => console.log(val),
    //   // complete: () => {},
    //   // error: () =>  {},
    // });

    this.customInterval$.subscribe({
      next: (val) => console.log(val),
      complete: () => console.log('Completed'),
    });

    const subscription = this.clickCount$.subscribe({
      next: (val) =>  console.log( `Click button ${this.clickCount()} times`)
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });


  }

  onClick(){
    this.clickCount.update(prevCount => prevCount + 1);
  }
}
