interface El {
    isOpen: boolean;
    isTag: boolean;
    d: string;
    params?: DOMParam[];
}

export interface DOMElement {
    name: string;
    data?: string;
    params?: DOMParam[];
    children?: DOMElement[];
}

interface DOMParam {
    key: string;
    value?: string;
}


export class Parser {

    rawText: string;
    elements: El[] = [];
    DOM: DOMElement[];

    constructor(rawText) {
        this.rawText = rawText;
    }

    parse(): void {
        this.elements = this.splitToElements(this.rawText, simpleTextNormalizer);
        this.DOM = this.buildTree(this.elements);
    }


    private splitToElements(
            rawText : string,
            textNormalizer : (string) => string    
        ): El[] {

        let myText = textNormalizer(rawText);

        let tf = /(^<.+?>)(.*)/;
        let tr = /(.*?)(<.+$)/;

        let tagFirst = myText.match(tf);
        let notTagFirst = myText.match(tr);

        let ii = 0;

        let myElements: El[] = [];
        while (tagFirst || notTagFirst) {
            // if (ii == 20) break;
            let myMatcher = tagFirst ? tagFirst : notTagFirst;

            // console.log(ii, '##############', myMatcher[1], ' $$$');
            myElements.push(elementBuilder(myMatcher[1], simpleOpenTagParser));
            myText = myMatcher[2];
            // console.log(elements, myText);

            tagFirst = myText.match(tf);
            notTagFirst = myText.match(tr);
            ii++;
        }

        if (myText) myElements.push(elementBuilder(myText, simpleOpenTagParser)); // if ther is st at the end

        return myElements;
    }

    private buildTree(elements : El[]): DOMElement[] {

        const recBuilder = (els: El[]): DOMElement[] => {

            let DOMEls: DOMElement[] = [];
            // console.log('## els', els);
            let j: number = 0;
            let openedAt: number;
            let openElement: El;

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
                        params: openElement.params,
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
        return recBuilder(this.elements);
    }
}


const elementBuilder = (
    raw: string,
    openTagParser: (string) => El
): El => {
    let closeTag = /<\/(.*)>/;
    let openTag = /<(.*)>/;

    if (raw.match(closeTag)) {
        return {
            isOpen: false,
            isTag: true,
            d: raw.match(closeTag)[1]
        };
    } else if (raw.match(openTag)) {
        return openTagParser(raw.match(openTag)[1]);
    } else {
        return {
            isOpen: false,
            isTag: false,
            d: raw
        };
    }
}

// parses an open tag to its params
const simpleOpenTagParser = (rawTag: string): El => {
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

export const simpleTextNormalizer = (rawText : string) : string => { 
        let myText: string = rawText
            .replace(/\n/g, ' ')
            .replace(/\t/g, ' ') // tab
            .replace(/ +/g, ' ') // double space
            .replace(/> </g, '><') // space b/w tags
            .replace(/<!--.*?-->/g, '') // comments
            .replace(/<script.*?\/script>/g, '') // JS
            .replace(/<!DOCTYPE html>/g, '') // JS
            
            

            
            ;
        return myText;
}
