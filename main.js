import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

let numbers = [1, 3, 5];

// let source = from(numbers);

let source = Observable.create(observer => {
  numbers.forEach((number, index, array) => {
    setTimeout(() => {
      observer.next(number);
      if (index === array.length - 1) {
        observer.complete();
      }
    }, 2000 * index);
  });
}).pipe(
  map(number => number * 2),
  filter(number => number > 2)
);

// More simple observer
source.subscribe(
  value => console.log(`value: ${value}`),
  error => console.log(`error ${error}`),
  () => console.log(('complete'))
);