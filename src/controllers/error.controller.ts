
import { Request, Response, NextFunction } from 'express';
import httpErrors from 'http-errors';

// 404 error handler
export async function NotFoundPage( req: Request, res: Response, next: NextFunction ) {
    return next( new httpErrors.NotFound( 'Requested Page Not Found' ) );
}

// form mongoose duplicate error
export const handleDuplicateKeyError = ( err: any, res: Response ) => {

    const field = Object.keys( err.keyValue );
    const code = 409;
    const error = `An account with this ${ field } already exists.`;
    return res.status( code ).send( { status: code, message: error } );

}

// mongoose validation error
export const handleValidationError = ( err: any, res: Response ) => {

    let errors = Object.values( err.errors ).
        map( ( el: any ) => el.message );
    let fields = Object.values( err.errors ).
        map( ( el: any ) => el.path );
    let code = 400;
    return res.status( code ).send( {
        message: errors, fields: fields, status: code
    } );

}

