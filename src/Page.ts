import { throws } from "assert";
import { hostname } from "os";

const https = require('https');

interface urlParam {
    hostname: string,
    path: string
}

export class Page {
    data: Buffer;
    headers;
    location : urlParam = {hostname : '', path : ''};

    constructor(url: string) {
        this.setLocation(url);
    }

    private setLocation(url: string) {
        let locElems = url.split('/');
        locElems.shift();
        locElems.shift();
        this.location.hostname = locElems.shift();
        this.location.path = '/' + locElems.join('/');
        console.log(this.location);
    }

    download() {
        let pr = new Promise((resolve, reject) => {
            let req = https.request({
                hostname: this.location.hostname,
                port: 443,
                path: this.location.path,
                method: 'GET'
            }, res => {
                console.log(res.statusCode);
                this.headers = res.headers;

                if (res.statusCode == '301') {
                    console.log('moved,', this.headers.location);
                    this.setLocation(this.headers.location);
                    this.download().then(resolve);
                } else {

                    res.on('data', d => {
                        this.data = d;
                        resolve(true);
                    });
                }
            });

            req.end();
        })
        return pr;
    }

    get asText(): string {
        return this.data.toString();
    }
}
