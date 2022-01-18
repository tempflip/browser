interface El {
    isOpen: boolean;
    isTag: boolean;
    d: string;
    params?: DOMParam[];
}

interface DOMParam {
    key: string;
    value?: string;
}

interface DOMElement {
    name: string;
    data?: string;
    params? : DOMParam[];
    children?: DOMElement[];
}

export class Parser {

    rawText: string;
    elements: El[] = [];
    DOM: DOMElement[];

    constructor(rawText) {
        this.rawText = rawText;
    }

    parse(): void {
        this.splitToElements();
        // this.buildTree();
    }


    private splitToElements(): void {
        let myText: string = this.rawText
            .replace(/\n/g, ' ')
            .replace(/ +/g, ' ')
            .replace(/> </g, '><')
            ;

        let tagParser = (rawTag: string): El => {
            let params: DOMParam[] = [];
            let tagRaw = rawTag.split(' ')[0];
            let paramsRaw = rawTag
                .split(' ') // everything but the tag,
                .slice(1,) // i.e. in 'a href="xxx" class="bu"'
                .join(' ') // everything but the 'a'
                ;
            let paramsRegex = /(\S+?)="(.+?)"(.*)/; // \S == not whitespace
            let paramsMatcher = paramsRaw.match(paramsRegex);

            while (paramsMatcher) {
                // console.log(paramsMatcher);
                params.push({
                    key: paramsMatcher[1],
                    value: paramsMatcher[2],
                });
                paramsMatcher = paramsMatcher[3].match(paramsRegex);
            }

            return {
                isOpen: true,
                isTag: true,
                d: tagRaw,
                params: params
            }
        }

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
                return tagParser(raw.match(openTag)[1]);
                // {
                //     isOpen: true,
                //     isTag: true,
                //     d: raw.match(openTag)[1]
                // };
            } else {
                return {
                    isOpen: false,
                    isTag: false,
                    d: raw
                };
            }
        }

        let tf = /(^<.+?>)(.*)/;
        let tr = /(.*?)(<.+$)/;

        let tagFirst = myText.match(tf);
        let notTagFirst = myText.match(tr);

        while (tagFirst || notTagFirst) {
            let myMatcher = tagFirst ? tagFirst : notTagFirst;

            // console.log(myMatcher);
            this.elements.push(elementBuilder(myMatcher[1]));
            myText = myMatcher[2];
            // console.log(elements, myText);

            tagFirst = myText.match(tf);
            notTagFirst = myText.match(tr);

        }

        if (myText) this.elements.push(elementBuilder(myText)); // if ther is st at the end
    }

    public buildTree(): void {

        const recBuilder = (els: El[]): DOMElement[] => {

            let DOMEls: DOMElement[] = [];
            // console.log('## els', els);
            let j: number = 0;
            let openedAt: number;
            let openElement : El;

            els.forEach((el, i) => {
                if (j == 0 && el.isOpen == true) {
                    openedAt = i;
                    // openType = el.d;
                    openElement = el;
                }
                if (el.d == openElement?.d && el.isOpen == true) {
                    j++;
                }
                if (el.d == openElement?.d && el.isOpen == false) {
                    j--;
                }

                // console.log(i, j, openedAt, openElement?.d, el);

                if (openElement && el.isOpen == false && j == 0) { // closing tag
                    // console.log('closed,', openedAt, i);
                    DOMEls.push({
                        name: openElement.d,
                        params : openElement.params,
                        children: recBuilder(els.slice(openedAt + 1, i))
                    });
                    openElement = undefined;
                    j = 0;
                } else if (!openElement && j == 0) {  // its just text
                    DOMEls.push({
                        name: 'text',
                        data: el.d
                    });
                }


            })
            return DOMEls;

        }
        this.DOM = recBuilder(this.elements);
        // console.log('this.DOM', JSON.stringify(this.DOM, null, 4));

    }
}
