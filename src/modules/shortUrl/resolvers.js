import shortid from 'shortid';

import ShortUrl from "../../models/ShortUrl";
import formatErrorResponse from '../../utils/formatErrorResponse';
import logToRedis from './logToRedis';

const { SHORT_URL_PATTERN } = process.env;

export const resolvers = {
    Query: {
        inflateUrl: async (_, args, { redis, url}) => {
            const { input: { shortCode }} = args;
            try {
                const isValidShortCode = shortid.isValid(shortCode);

                if(isValidShortCode) {
                    const item = await ShortUrl.findOne({ shortCode });
                    if(item) {
                        console.log(item);
                        return {
                            statusCode: 200,
                            message: 'success',
                            data: {
                                originalUrl: item.originalUrl
                            }
                        }
                    }
                } else {
                    return {
                        statusCode: 404,
                        message: 'not Found',
                        error: null
                    }
                }


            } catch (err) {
                return {
                    statusCode: 404,
                    message: 'not Found',
                    error: null
                }
            }
        }
    },
    Mutation: {
        shortUrl: async (_, args, { redis, url}) => {
            const { input: { originalUrl }} = args;
            const shortCode = shortid.generate(SHORT_URL_PATTERN);
            try {
                // let check if url already registered
                const item = await ShortUrl.findOne({ originalUrl });
                
                // document exists lets return back as response
                if(item) {
                    const { shortCode } = item;
                    return {
                        statusCode: 200,
                        message: 'success',
                        data: {
                            shortCode,
                            shortUrl: `${url}/inflate/${shortCode}`
                        }
                    }
                }

                const shortUrl = new ShortUrl({ originalUrl, shortCode });

                // first validate the schema before insert
                await shortUrl.validate();

                // alight now time to create a document in our mongo
                await shortUrl.save();

                // let`s insert into redis
                await logToRedis(shortUrl, redis);

                // let`s return back the response with created record 
                return {
                    statusCode: 201,
                    message: 'shortUrl Created Successfully',
                    error: null,
                    data: {
                        shortCode: shortUrl.shortCode,
                        shortUrl: `${url}/inflate/${shortCode}`
                    }
                };

            } catch (err) {
                return {
                    statusCode: 422,
                    message: 'Unprocessable Entity',
                    error:  formatErrorResponse(err)
                };
            }
        }
    }
}