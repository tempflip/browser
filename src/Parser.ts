interface El {
    isOpen: boolean;
    isTag: boolean;
    d: string;
}

interface DOMElement {
    name: string;
    data?: string;
    propMap?;
    children: DOMElement[];
}

export class Parser {

    rawText: string;
    elements: El[] = [];
    DOM: DOMElement[];

    constructor(rawText) {
        this.rawText = rawText;
    }

    parse() {
        this.splitToElements();
        this.buildTree();
    }


    private splitToElements() {
        let myText: string = this.rawText
            .replace(/\n/g, ' ')
            .replace(/ +/g, ' ')
            .replace(/> </g, '><')
            ;

        let tf = /(^<.+?>)(.*)/;
        let tr = /(.*?)(<.+$)/;

        let tagFirst = myText.match(tf);
        let notTagFirst = myText.match(tr);

        let elementBuilder = (raw: string): El => {
            let closeTag = /<\/(.*)>/;
            let openTag = /<(.*)>/;

            if (raw.match(closeTag)) {
                return {
                    isOpen: false,
                    isTag: true,
                    d: raw.match(closeTag)[1]
                };
            } else if (raw.match(openTag)) {
                return {
                    isOpen: true,
                    isTag: true,
                    d: raw.match(openTag)[1]
                };
            } else {
                return {
                    isOpen: false,
                    isTag: false,
                    d: raw
                };
            }
        }

        while (tagFirst || notTagFirst) {
            let myMatcher = tagFirst ? tagFirst : notTagFirst;

            // console.log(myMatcher);
            this.elements.push(elementBuilder(myMatcher[1]));
            myText = myMatcher[2];
            // console.log(elements, myText);

            tagFirst = myText.match(tf);
            notTagFirst = myText.match(tr);

        }
        if (myText) this.elements.push(elementBuilder(myText));
    }

    private buildTree(): void {

        const recBuilder = (els: El[]): DOMElement[] => {
            let DOMElements: DOMElement[] = [];

            console.log(els);

            // if (els.length == 1 && els[0].isTag == false) {
            //     return [{
            //         name : 'text',
            //         data : els[0].d,
            //         children : []
            //     }];
            // }


            console.log('# start', els.length);

            let i: number = 0;
            let j: number = els.length - 1;
            let openElement: El;

            while (j >= i) {
                openElement = els[i];
                console.log(i, j, openElement.d, els[j].d);

                // its just a tag, push and next
                if (!openElement.isTag) {
                    DOMElements.push(
                        {
                            name: 'text',
                            data: openElement.d,
                            children: []
                        }
                    )
                    i++;
                    continue;
                }

                // found the closing element
                if (!els[j].isOpen && els[j].d == openElement.d) {
                    console.log('f', i, j);

                    // let childrenEls : El[] = [];

                    let domEl: DOMElement = {
                        name: openElement.d,
                        children: recBuilder(els.slice(i + 1, j))
                    }
                    DOMElements.push(domEl);

                    i = j + 1
                    j = els.length;
                }
                j--;
            }
            return DOMElements;
        }
        this.DOM = recBuilder(this.elements);
        console.log('this.DOM', JSON.stringify(this.DOM, null, 4));

    }
}
