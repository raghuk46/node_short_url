import rp from 'request-promise';

class ShorturlAssertion {
    constructor(url) {
        this.url = url;
        this.options = {
            withCredentials: true,
            jar: rp.jar(),
            json: true,
        };
    }

    async shortUrl(originalUrl) {
        const response = await rp.post(this.url, {
            ...this.options,
            body: {
                query: `mutation { 
                        shortUrl(input: { originalUrl: "${originalUrl}"}) {
                            statusCode
                            message
                            error {
                                path
                                message
                            }
                            data {
                                shortCode
                                shortUrl
                            }
                        } 
                }`,
            },
        });
        return response.data;
    }

    async inflateUrl(shortCode) {
        const response = await rp.post(this.url, {
            ...this.options,
            body: {
                query: `query { 
                    inflateUrl(input: { shortCode: "${shortCode}"}) {
                        statusCode
                        message
                        error {
                            path
                            message
                        }
                        data {
                            originalUrl
                        }
                    }
                }`,
            }
        });
        return response.data;
    }

}

export default ShorturlAssertion;