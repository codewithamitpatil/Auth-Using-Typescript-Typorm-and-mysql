
import config from 'config';
import httpErrors from 'http-errors';
import { get } from 'lodash';
import parser from 'ua-parser-js';
import ip from 'ip';
import { autoInjectable } from "tsyringe";

import express, {
    NextFunction,
    Request,
    Response,
    Router
} from 'express';


import SessionService from '../services/session.service';
import UserService from '../services/user.service';
import JwtService from '../services/jwt.service';
import { UserDocument } from '../interface/user.interface';


@autoInjectable()
export default class SessionController {

    private readonly sessionService: SessionService;
    private readonly userService: UserService;
    private readonly jwtService: JwtService;

    constructor(
        sessionService: SessionService,
        userService: UserService,
        jwtService: JwtService
    ) {
        this.sessionService = sessionService;
        this.userService = userService;
        this.jwtService = jwtService;
    }

    // Login
    public createUserSessionHandler = async (
        req: Request,
        res: Response,
        next: NextFunction ) => {

        const { email, password } = req.body;

        const user = await this.userService.
            validateCredentials(
                email,
                password
            );

        if ( !user || get( user, "message" ) ) return next( user );

        // to get user meta data
        const ua = parser( req.headers['user-agent'] );
        const browser = ua.browser.name || "";
        const os = ua.os.name || "";
        const ip4 = ip.address() || "";

        // session obj
        const sessionObj = {
            uid: user.uid,
            browser,
            os,
            ip4
        };

        // create session 
        const session = await this.sessionService.
            create( sessionObj );

        // create access token
        const accessToken = await this.jwtService.
            createAccessToken( user, session );

        // create refresh token
        const refreshToken = await this.jwtService.
            createRefreshToken( session );

        // return tokens


        // res.cookie( "accessToken", accessToken, {
        //     maxAge: 900000, // 15 mins
        //     httpOnly: true,
        //     domain: "localhost",
        //     path: "/",
        //     sameSite: "strict",
        //     secure: false,
        // } );

        res.cookie( "refreshToken", refreshToken, {
            maxAge: 3.154e10, // 1 year
            httpOnly: true,
            domain: "localhost",
            path: "/",
            secure: false,
            sameSite: 'lax'
        } );


        return res.send( {
            status: 200,
            message: 'login success',
            role: user.role,
            accessToken,
            refreshToken,

        } );
    }

    // logout
    public invalidateUserSessionHandler = async (
        req: Request,
        res: Response,
        next: NextFunction ) => {


        const sid = get( req, "user.sid" );

        await this.sessionService.update( sid, { valid: false } );

        res.clearCookie( 'refreshToken' );
        res.send( {
            status: 200,
            message: 'logout success'
        } );



    }

    // previous login
    public getUserSessionsHandler = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        const uid = get( req, "user.uid" );
        const sid = get( req, "user.sid" );

        const session = await this.sessionService.
            getAll( uid );

        res.send( {
            status: 200,
            message: "session success",
            current: sid,
            data: session
        } );

    }

    public getRefreshTokenHandler = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        console.log( req.cookies );

        const refreshToken = get( req, "cookies.refreshToken" );

        const token = await this.jwtService.reIssueAccessToken( refreshToken );

        if ( !token ) {
            return next( new httpErrors.BadRequest( 'Plz Login' ) );
        }

        res.send( { accessToken: token?.accessToken, role: token?.role } );
    }

}