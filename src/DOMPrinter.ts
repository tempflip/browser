import { DOMElement } from './Parser'

export class DOMPrinter {

    constructor(private DOMElementList: DOMElement[]) {
    }

    public print() {
        reqPrinter(this.DOMElementList);
    }
}

const reqPrinter = (
    els: DOMElement[],
    depth: number = 0): void => {

    els.forEach(el => {
        console.log('##',
            ' '.repeat(depth),
            el.name,
            el.data ? el.data : ''
        );
        if (el.children) {
            reqPrinter(el.children, depth + 1);
        }
    })
}