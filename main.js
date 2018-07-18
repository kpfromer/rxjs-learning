import { defer } from 'rxjs/observable/defer';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { delay, flatMap, retryWhen, scan } from 'rxjs/operators';

const outputDiv = document.getElementById('output');
const button = document.getElementById('button');

const click = fromEvent(button, 'click');

const loadWithFetch = url => defer(
  () => fromPromise(
    fetch(url).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(response)
      }
    })
  )
).pipe(
  retryWhen(retryStrategy())
);

const retryStrategy = ({ attempts = 4, delay: delayTime = 1000 } = {}) => errors =>
  errors.pipe(
    scan((acc, error) => {
      acc += 1;
      if (acc < attempts) {
        return acc;
      } else { // Throw error if it continues to break after x amount of "attempts"
        throw new Error(error); // Usually thrown error in rxjs break the whole chain and code but since it is in a retryWhen, errors are expected and mapped to Observer.error() method
      }
    }, 0),
    delay(delayTime)
  );

// More simple observer
click
  .pipe(
    flatMap(() => loadWithFetch('moviess.json'))
  )
  .subscribe(
  movies => {
    movies.forEach(movie => {
      const div = document.createElement('div');
      div.innerText = movie.title;
      outputDiv.appendChild(div);
    })
  },
  error => console.log(`error ${error}`),
  () => console.log(( 'complete' ))
);