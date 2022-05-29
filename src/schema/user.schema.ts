
import joi from 'joi';
import httpErrors from 'http-errors';

import { Role } from '../constant/role.constant';

//signup
export const signupSchema = joi.object( {

    body: joi.object( {

        uname: joi.string()
            .required(),
        email: joi.string()
            .email()
            .required(),
        role: joi.string()
            .valid( Role.USER, Role.ADMIN )
            .error( new httpErrors.BadRequest( 'Invalid Role' ) ),
        password: joi.string()
            .min( 6 )
            .max( 12 )
            .required()

    } )

} );

// signin
export const signinSchema = joi.object( {

    body: joi.object( {

        email: joi.string()
            .email()
            .required()
            .error( new httpErrors.BadRequest( 'All Fields Are Required' ) ),
        password: joi.string()
            .required()
            .error( new httpErrors.BadRequest( 'All Fields Are Required' ) )

    } )

} );

// change password
export const changepassSchema = joi.object( {
    body: joi.object( {

        password: joi.string()
            .required()
            .error( new httpErrors.BadRequest( 'Old Password is required' ) ),
        newpassword: joi.string()
            .min( 6 )
            .max( 12 )
            .required()

    } )
} );

// forget password
export const forgetpassSchema = joi.object( {
    body: joi.object( {
        email: joi.string()
            .email()
            .required()
    } )
} );

// reset password
export const resetpassSchema = joi.object( {
    body: joi.object( {
        password: joi.string()
            .min( 6 )
            .max( 12 )
            .required()
    } )
} );