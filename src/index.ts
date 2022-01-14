import { Page } from './Page'

let p: Page = new Page('https://wikipedia.org/');

p.download().then(() => {
    console.log('Success!');
    // console.log(p.headers);
    console.log(p.asText);
});
