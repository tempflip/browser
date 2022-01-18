import { Page } from './Page'
import { Parser } from './Parser';

const process = require('process');
process.stdin.on('data', d => {
    let pa = new Parser(d.toString());
    pa.parse();
    pa.buildTree();
    // console.log(JSON.stringify(pa.elements, null, 2));


    // console.log(pa.DOM);

    console.log(JSON.stringify(pa.DOM, null, 2));

});
