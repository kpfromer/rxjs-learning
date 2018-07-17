import { Observable } from 'rxjs';

let numbers = [1, 3, 5];

// let source = from(numbers);

let source = Observable.create(observer => {
  numbers.forEach(number => {
    // NOTE: errors stop observable chain so 5 will NOT be reported!
    // if (number === 3) {
    //   return observer.error('Number cant be 3');
    // }

    return observer.next(number);
  });
  observer.complete();
});

// More simple observer
source.subscribe(
  val => console.log(val),
  error => console.log(error),
  () => console.log('complete')
);

// More defined observer
class MyObserver {

  next(value) {
    console.log(`value: ${value}`);
  }

  error(error) {
    console.log(`error ${error}`);
  }

  complete() {
    console.log('complete');
  }

}

source.subscribe(new MyObserver());