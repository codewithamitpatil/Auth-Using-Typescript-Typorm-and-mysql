
import { get } from "lodash";
import { autoInjectable } from 'tsyringe';
import httpError from 'http-errors';

import {
    NextFunction,
    Request,
    Response
} from "express";

import UserService from "../services/user.service";


@autoInjectable()
export default class UserController {

    constructor(
        private readonly userService: UserService,
    ) {

    }

    public createAcHandler = async (
        req: Request,
        res: Response,
        next: NextFunction ) => {

        const data = req.body;

        const emailCheck = await this.userService.emailCheck( data.email );
        if ( emailCheck ) {
            return next( new httpError.BadRequest( 'Email Is Already Exist' ) );
        }

        const unameCheck = await this.userService.unameCheck( data.uname );
        if ( unameCheck ) {
            return next( new httpError.BadRequest( 'Username Is Already Exist' ) );
        }

        // create user 
        const user = await this.userService.createUser( data );

        // send verfication link
        const link = await this.userService.VerifyLink( data.email );

        res.send( { status: 200, email: req.body.email, message: "Account Created SuccessFully .Plz verify your email" } );

    }

    public verifyAcByLink = async (
        req: Request,
        res: Response,
        next: NextFunction ) => {

        const { uid, token } = req.params;

        const data = await this.userService.VerifyAcByLink( parseInt( uid ), token );

        if ( !data ) {
            return res.redirect( 'http://localhost:3000/verify/fail' );
            // return next( new httpError.BadRequest( 'Invalid Link' ) )
        }

        return res.redirect( 'http://localhost:3000/verify/sucess' );
        //    res.send( { status: 200, message: "Account Verified SuccessFully .Now You Can Signin" } );

    }


    public sendAcVerifyLink = async (
        req: Request,
        res: Response,
        next: NextFunction ) => {

        const { email } = req.body;


        // send verfication link
        const link = await this.userService.
            VerifyLink( email );

        if ( !link || get( link, 'status' ) ) {
            return next( link );
        }

        res.send( { status: 200, message: "Verification link has been send on your registered email id" } );

    }

    public changeAcPassHandler = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const email = get( req, "user.email" );
        const { password, newpassword } = get( req, "body" );

        const data = await this.userService.
            changePassword( email, password, newpassword );

        if ( !data || get( data, 'status' ) ) {
            return next( data );
        }

        res.send( { status: 200, message: "Password Updated SuccessFully" } );

    }

    public forgotPassHandler = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const { email } = req.body;

        const data = await this.userService.
            forgetPassword( email );

        if ( !data || get( data, 'status' ) ) {
            return next( data );
        }


        res.send( {
            status: 200,
            message: `An Reset Password E-Mail Has Been Sent To ${ email } With Further Instructions.`
        } );


    }

    public resetPassHandler = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        const token = get( req, "params.token" );
        const password = get( req, "body.password" );



        const data = await this.userService.
            resetPassword( token, password );
        return res.send( data )
        if ( !data || get( data, 'status' ) ) {
            return next( data );
        }

        res.send( {
            data,
            status: 200,
            message: `Success! Your password has been changed.`
        } );

    }

    public curLoggedInUserHandler = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const uid = get( req, "user.uid" );
        const data = await this.userService.
            loggedInUser( uid );

        if ( !data || get( data, 'message' ) ) {
            return res.send( {
                status: 200,
                message: 'success',
                loggedin: false,
            } );
        }
        res.send( {
            status: 200,
            message: 'success',
            loggedin: true,
            data
        } );
    }

}


