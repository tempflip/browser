interface El {
    isOpen: boolean;
    isTag : boolean;
    d: string;
}

export class Parser {

    rawText: string;
    elements : El[] = [];

    constructor(rawText) {
        this.rawText = rawText;
    }

    parse() {
        this.splitToElements();
        // this.buildTree();
    }


    private splitToElements() {
        let myText: string = this.rawText.replace(/\n/g, ' ');

        let tf = /(^<.+?>)(.*)/;
        let tr = /(.*?)(<.+$)/;

        let tagFirst = myText.match(tf);
        let notTagFirst = myText.match(tr);

        let elementBuilder = (raw : string) : El => {
            let closeTag = /<\/(.*)>/;
            let openTag = /<(.*)>/;

            if (raw.match(closeTag)) {
                return {
                    isOpen: false,
                    isTag : true,
                    d: raw.match(closeTag)[1]
                };
            } else if (raw.match(openTag)) {
                return {
                    isOpen: true,
                    isTag : true,
                    d: raw.match(openTag)[1]
                };
            } else {
                return {
                    isOpen: false,
                    isTag : false,
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
}
