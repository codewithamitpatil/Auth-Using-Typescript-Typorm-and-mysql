
import { autoInjectable } from "tsyringe";
import config from 'config';
import { get, omit, Omit } from 'lodash';
import httpError from 'http-errors';
import jwt from 'jsonwebtoken';


import { UserDocument } from "../interface/user.interface";
import { SessionDocument } from "../interface/session.interface";
import SessionRepository from "../repository/session.repository";
import { UserRepository } from "../repository/user.repository";


@autoInjectable()
export default class JwtService {

    private readonly sessionRepo: SessionRepository;
    private readonly userRepo: UserRepository;


    private readonly privateKey =
        config.get( 'privateKey' ) as string;

    private readonly accessTokenTtl =
        config.get( 'accessTokenTtl' ) as string;

    private readonly refreshTokenTtl =
        config.get( 'refreshTokenTtl' ) as string;


    constructor(
        sessionRepo: SessionRepository,
        userRepo: UserRepository ) {
        this.userRepo = userRepo;
        this.sessionRepo = sessionRepo;
    }


    // encode token
    public sign( data: any ) {

        const { obj, options } = data;

        return jwt.sign( obj, "amit", options );

    }

    // decode token
    public decode( token: any ) {

        try {

            const decoded = jwt.verify( token, "amit" );

            return {
                decoded,
                valid: true,
                expired: false
            }
        } catch ( error ) {
            return {
                decoded: null,
                valid: false,
                expired: true
            }
        }

    }


    public async createAccessToken(
        user: object,
        session: object
    ) {

        user = omit( user, "password", "os",
            "verifyAccountExpires",
            "verifyAccountToken",
            "updatedAt",
            "resetPasswordToken",
            "resetPasswordExpires",
            "createdAt",
            "acblock"
        );

        session = omit( session,
            "createdAt",
            "updatedAt",

        );
        const accessToken = this.sign( {
            obj: {
                ...user,
                ...session
            },
            options: {
                expiresIn: this.accessTokenTtl
            }
        } );

        // check toke  is genrated or not
        if ( !accessToken ) {
            return new httpError.InternalServerError();
        }

        return accessToken;
    }

    public async reIssueAccessToken( refreshToken: string ) {


        // Decode the refresh token
        const { decoded } = this.decode( refreshToken );

        const sid = get( decoded, "sid" );
        const uid = get( decoded, "uid" );
        if ( !decoded || !get( decoded, "uid" ) ) return false;


        // Get the session
        const session = await this.sessionRepo.
            getSession( { sid } );

        // Make sure the session is still valid
        if ( !session || session.valid == false ) return false;

        // get the user
        let user = await this.userRepo.getUserById( uid );

        if ( !user ) return false;


        // genrate new access token
        const accessToken = await this.createAccessToken( user, session );

        return { accessToken, role: user.role };

    }

    public async createRefreshToken( session: object ) {

        const refreshToken = this.sign( {
            obj: {
                ...session
            },
            options: {
                expiresIn: this.refreshTokenTtl
            }
        } );

        // check toke  is genrated or not
        if ( !refreshToken ) {
            return new httpError.InternalServerError();
        }

        return refreshToken;

    }

}