import { Page } from './Page'
import { Parser, simpleTextNormalizer } from './Parser';
import {DOMPrinter} from './DOMPrinter';

const process = require('process');
process.stdin.on('data', d => {
    // console.log(d.toString());
    // console.log('....................................................');
    // console.log('....................................................');
    // console.log('....................................................');
    // console.log('....................................................');
    // console.log('....................................................');
    // console.log('....................................................');
    // console.log('....................................................');

    // console.log(simpleTextNormalizer(d.toString()));

    let pa = new Parser(d.toString());
    pa.parse();
    // console.log(pa.elements);
    // console.log(JSON.stringify(pa.DOM, null, 2));
    // console.log(pa.DOM);

    let pr : DOMPrinter = new DOMPrinter(pa.DOM);
    pr.print();

    // pa.elements.forEach(el => {
    //     console.log(
    //         (el.isOpen == true ? '#' : '/'),
    //         el.d);
    // })


});
