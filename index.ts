import { Observable, Subject, Subscriber, Subscription } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import './style.css';

console.clear();

const ob: Observable<number> = new Observable((observer) => {
  let count: number = 0;
  const btn = document.getElementById('btnApp');
  const btnClickEventHandler = () => {
    console.log('event emit');
    count++;
    observer.next(count);
    // 3 féle képpen ér el az observable az életciklus végére
    // hibára fut
    // completed
    // ha senki nem kiványcsi rá és leiratkozik

    /*
    if (count === 3) {
      observer.error('Hibára futottam');
    }
    if (count === 4) {
      observer.complete();
    }

    if (count === 5) {
      observer.unsubscribe();
    }
    */
  };

  btn.addEventListener('click', btnClickEventHandler);

  // Felszabadító függvény
  return () => {
    btn.removeEventListener('click', btnClickEventHandler);
  };
});

/*
// felirtkozás nélkül az observer nem indul el
// 1 observer 2 eseményt is tud emittálni
// új syntax
const sunscriber1 = subject.subscribe({
  next: (res) => console.log(res),
  error: (err) => console.log(err),
  complete: () => console.log('complete'),
});
*/

/*
// Ha többször iratkozunk fel az observablere akkor mindig létrehoz egy új Observablet
// Ezért fut le kétszer az emit ebben az esetben
// Erőforrásigényes és sokszor erre nincs szükség
// A cél, hogy egy observable legyen és több feliratkozója
// Megoldás a Subject bevezetése

const sunscriber1 = ob.subscribe({
  next: (res) => console.log(res),
  error: (err) => console.log(err),
  complete: () => console.log('complete'),
});

const sunscriber2 = ob.subscribe({
  next: (res) => console.log(res),
  error: (err) => console.log(err),
  complete: () => console.log('complete'),
});
*/

// Subject az observable-k speciális altipíusai
// Subjettel többször is feliratkozhatunk és csak egy observable jön létre
let subject: Subject<number> = new Subject<number>();

const obSubject: Subscription = ob.subscribe(subject);

const subscriber1 = subject
  .pipe(
    tap((res: number) => console.log('tap:', res)),
    map((res: number) => res + 1),
    filter((res: number) => res % 2 === 0)
  )
  .subscribe({
    next: (res: number) => {
      console.log('subscribe1', res);
      if (res >= 5) {
        subscriber1.unsubscribe();
      }
    },
    error: (err) => console.log(err),
    complete: () => console.log('complete'),
  });

const subscriber2 = subject.subscribe({
  next: (res: number) => {
    console.log('subscribe2', res);
    if (res === 7) {
      subscriber2.unsubscribe();
      obSubject.unsubscribe();
    }
  },
  error: (err) => console.log(err),
  complete: () => console.log('complete'),
});
