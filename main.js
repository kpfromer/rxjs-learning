import { fromEvent } from 'rxjs';
import { delay, filter, map } from 'rxjs/operators';

const circle = document.getElementById('circle');

let source = fromEvent(document, 'mousemove')
  .pipe(
    map(
      event => ( {
        x: event.clientX,
        y: event.clientY
      } )
    ),
    filter(
      event => event.x < 500
    ),
    delay(300)
  );

// More simple observer
source.subscribe(
  ({ x, y }) => {
    circle.style.left = x - circle.clientWidth / 2;
    circle.style.top = y - circle.clientHeight / 2;
  },
  error => console.log(`error ${error}`),
  () => console.log(( 'complete' ))
);