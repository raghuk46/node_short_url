import ShorturlAssertion from './assertions/shorturlAssertion';
import Redis from 'ioredis';
import fetch from 'node-fetch';

const url = `http://${process.env.HOST}:${process.env.PORT}/graphql`;
const baseUrl = `http://${process.env.HOST}:${process.env.PORT}`;
const client = new ShorturlAssertion(url);
const redis = new Redis();

describe('Short Url Generation', async () => {
    it('should throw error if orginalUrl is null', async () => {
        const response = await client.shortUrl(null);
        expect(response.shortUrl.statusCode).toBe(422);
        expect(response.shortUrl.error).toHaveLength(1);
        expect(response.shortUrl.error).toEqual([
            {
                path: 'originalUrl',
                message: 'null is not a Valid URL!'
            }
        ]);
    });

    it('should throw error if orginalUrl is not Valid', async () => {
        const response = await client.shortUrl('google');
        expect(response.shortUrl.statusCode).toBe(422);
        expect(response.shortUrl.error).toHaveLength(1);
        expect(response.shortUrl.error).toEqual([
            {
                path: 'originalUrl',
                message: 'google is not a Valid URL!'
            }
        ]);
    });

    
    it('should create a create a record if valid OriginalUrl', async () => {
        const response = await client.shortUrl('http://iproperty.com.my');
        expect(response.shortUrl.statusCode).toBe(201);
        expect(response.shortUrl.message).toEqual('shortUrl Created Successfully');
        expect(response.shortUrl.data).toEqual(
            {
                shortCode: response.shortUrl.data.shortCode,
                shortUrl: `${baseUrl}/inflate/${response.shortUrl.data.shortCode}`
            }
        )
    });

    it('should not create duplicate record for same OriginalUrl', async () => {
        const response = await client.shortUrl('http://iproperty.com.my');
        expect(response.shortUrl.statusCode).toBe(200);
        expect(response.shortUrl.message).toEqual('success');
        expect(response.shortUrl.data).toEqual({
            shortCode: response.shortUrl.data.shortCode,
            shortUrl: `${baseUrl}/${response.shortUrl.data.shortCode}`
        })
    });
});
