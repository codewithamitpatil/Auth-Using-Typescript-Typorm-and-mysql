
import joi from 'joi';
import httpErrors from 'http-errors';

// update schema
export const updateSchema = joi.object( {

    body: joi.object( {
        name: joi.string(),
        gender: joi.string().valid( "MALE", "FEMALE", "OTHER" ),
        clg: joi.string(),
        nation: joi.string(),
        education: joi.string(),
        intro: joi.string(),
        rank: joi.number(),
        point: joi.number(),
        phone: joi.string(),
        address: joi.string()
    } )

} );