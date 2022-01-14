export class Parser {

    rawText : string;
    elements : string[] = [];

    constructor(rawText) {
        this.rawText = rawText;
    }

    parse() {
        let myText : string = this.rawText.replace(/\n/g, ' ');

        let tf = /(^<.+?>)(.*)/;
        let tr = /(.*?)(<.+$)/;

        let tagFirst = myText.match(tf);
        let notTagFirst = myText.match(tr);
        
        while (tagFirst || notTagFirst) {
            let myMatcher = tagFirst ? tagFirst : notTagFirst;
            
            // console.log(myMatcher);
            this.elements.push(myMatcher[1]);
            myText = myMatcher[2];
            // console.log(elements, myText);

            tagFirst = myText.match(tf);
            notTagFirst = myText.match(tr);
    
        }
        if (myText) this.elements.push(myText);
    }
}
