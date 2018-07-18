import { Observable } from 'rxjs/Observable';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { delay, retryWhen, scan } from 'rxjs/operators';

const outputDiv = document.getElementById('output');
const button = document.getElementById('button');

const click = fromEvent(button, 'click');

function load(url) {
  const xhr = new XMLHttpRequest();

  return Observable.create(observer => {

    const onLoad = () => {

      if (xhr.status >= 200 && xhr.status < 300) {
        observer.next(JSON.parse(xhr.responseText));
        observer.complete();
      } else {
        observer.error(xhr.statusText);
      }
    };

    xhr.addEventListener('load', onLoad);

    xhr.open('GET', url);
    xhr.send();

    return () => {
      xhr.removeEventListener('load', onLoad);
      xhr.abort();
    }; // This is run when the Observable is unsubscribed from
  }).pipe(
    retryWhen(retryStrategy())
  );
}

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

const loading = load('movies.json').subscribe(() => {});
loading.unsubscribe(); // Aborts the xhr request

// More simple observer
// click
//   .pipe(
//     flatMap(() => load('movies.json'))
//   )
//   .subscribe(
//   movies => {
//     movies.forEach(movie => {
//       const div = document.createElement('div');
//       div.innerText = movie.title;
//       outputDiv.appendChild(div);
//     })
//   },
//   error => console.log(`error ${error}`),
//   () => console.log(( 'complete' ))
// );