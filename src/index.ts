import { Page } from './Page'
import { Parser } from './Parser';

const process = require('process');
process.stdin.on('data', d => {
    let pa = new Parser(d.toString());
    pa.parse();
    // console.log(pa.elements);
    // console.log(pa.DOM);
});
