import { fromEvent, Observable } from 'rxjs';
import { delay, flatMap, retryWhen, scan, takeWhile } from 'rxjs/operators';

const outputDiv = document.getElementById('output');
const button = document.getElementById('button');

let click = fromEvent(button, 'click');

function load(url) {
  const xhr = new XMLHttpRequest();

  return Observable.create(observer => {
    xhr.addEventListener('load', () => {

      if (xhr.status >= 200 && xhr.status < 300) {
        observer.next(JSON.parse(xhr.responseText));
        observer.complete();
      } else {
        observer.error(xhr.statusText);
      }
    });

    xhr.open('GET', url);
    xhr.send();
  }).pipe(
    retryWhen(retryStrategy({ attempts: 4, delay: 2000 }))
  );

}

const retryStrategy = ({ attempts = 4, delay: delayTime = 1000 }) => errors =>
  errors.pipe(
    scan(acc => acc + 1, 0),
    takeWhile(acc => acc < attempts),
    delay(delayTime)
  );

// More simple observer
click
  .pipe(
    flatMap(() => load('movies.json'))
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