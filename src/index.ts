import { Page } from './Page'
import { Parser } from './Parser';

// let p: Page = new Page('https://wikipedia.org/');

// p.download().then(() => {
//     console.log('Success!');
//     console.log(p.asText);
// });


let t = `<html>
<div>
    <h1>Ez cim</h1><b> ez felkover</b>
    Ez szoveg.
    <div>
        masodik kis ablak<i></i>
    </div>
</div>

</html><baaa!!>xx`

// let t = `naja  <html> hahha </html><bu></dda>aaghh</da> naaa`
// let t = `hahha </html> naaa`



let pa = new Parser(t);
pa.parse();
console.log(pa.elements);