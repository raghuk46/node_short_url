import mongoose, { Schema } from 'mongoose';
import validator from 'validator';

const ShortUrlSchema = new Schema({
        originalUrl: {
            type: String,
            trim: true,
            required: [true, 'Url is Required!'],
            validate:{
                validator(originalUrl) {
                    return validator.isURL(originalUrl);
                },
                message: '{VALUE} is not a Valid URL!'
            }
        },
        shortCode: {
            type: String,
            trim: true,
            required: [true, 'shortCode is Required!']
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model('ShortUrl', ShortUrlSchema);