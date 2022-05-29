
import { get } from "lodash";
import { autoInjectable } from 'tsyringe';
import httpError from 'http-errors';
import config from 'config';

import {
    NextFunction,
    Request,
    Response
} from "express";

import JwtService from "../services/jwt.service";

import {
    handleDuplicateKeyError,
    handleValidationError
} from '../controllers/error.controller';


@autoInjectable()
export default class CommonMiddleware {

    private readonly privateKey =
        config.get( 'privateKey' ) as string;

    constructor( private readonly JwtService: JwtService ) {

    }

    public asyncHandler = ( fn: Function ) => {
        return (
            req: Request,
            res: Response,
            next: NextFunction ) => {

            Promise.
                resolve( fn( req, res, next ) ).
                catch( next );

        }
    }

    public requiresUser = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        const user = get( req, "user" );

        if ( !user ) {
            return next( new httpError.Forbidden() );
        }

        return next();
    };

    public requiresAdmin = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        const user = get( req, "user.role" );

        if ( user !== "ADMIN" ) {
            return next( new httpError.Unauthorized() );
        }

        return next();
    };

    public deserializeUser = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {


        let refreshToken = get( req, "headers.x-refresh" );

        let accessToken = get( req, "headers.authorization", "" ).replace( /^Bearer\s/, "" );

        // access token check
        if ( !accessToken ) return next();

        let { decoded, expired } = this.JwtService.decode( accessToken );

        if ( decoded ) {
            //@ts-ignore
            req.user = decoded;
            return next();
        }

        if ( expired ) {
            return next( new httpError.Forbidden() );
        }


    };

    public validateRequest = ( schema: any ) => async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        try {

            await schema.validateAsync( {
                body: req.body
            } );

            return next();

        } catch ( error ) {
            return next( error );
        }


    };

    public errorHandler = async (
        err: any,
        req: Request,
        res: Response,
        next: NextFunction ) => {

        console.log( err );

        if ( err.isJoi ) {
            return res.status( 400 ).json( {
                'status': 400,
                'message': err.message
            } )
        }

        // for mongoose confilict error 
        if ( err.name === "ValidationError" ) {
            return handleValidationError( err, res );
        }

        // for mongoose confilict error 
        if ( err.code && err.code == 11000 ) {
            return handleDuplicateKeyError( err, res );
        }

        err.status = err.status || 500;
        if ( err.code == 'ER_DUP_ENTRY' ) {
            err.status = 409;
            err.message = "Duplicate Key"
        }

        return res.status( err.status ).send( {
            status: err.status,
            message: err.message
        } )
    };


}

