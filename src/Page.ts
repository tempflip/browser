export class Page {
    url;
    constructor(url : string) {
        this.url = url;
    }

    download() {
        console.log('## downloading...', this.url);
    }
}
