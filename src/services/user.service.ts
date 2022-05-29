
import { autoInjectable } from "tsyringe";
import { get, omit } from 'lodash';
import httpError from 'http-errors';
import crypto from 'crypto';
import config, { has } from 'config';
import bcrypt from 'bcrypt';

import { UserRepository } from "../repository/user.repository"
import { UserDocument } from "../interface/user.interface";


// for messaging rabit mq
import Publish from "../utils/publisher";

@autoInjectable()
export default class UserService {

    private readonly baseUrl = config.get( 'baseUrl' ) as string;
    private readonly serviceUrl = config.get( 'serviceUrl' ) as string;

    constructor(
        private readonly userRepo: UserRepository,

    ) {
    }

    async createUser( user: UserDocument ) {
        let hash = await bcrypt.hash( user.password, 10 );
        const temp = { ...user, password: hash }
        const User = await this.userRepo.createUser( temp );
        return omit( User, "password" );
    }

    async unameCheck( uname: UserDocument['uname'] ) {
        return await this.userRepo.isUsernameExist( uname );
    }

    async emailCheck( email: UserDocument['email'] ) {
        return await this.userRepo.isEmailExist( email );
    }



    async VerifyLink( email: UserDocument['email'] ) {

        const user = await this.userRepo.getUserByEmail( email );

        if ( !user ) {
            return ( new httpError.BadRequest( 'No account with that email address found' ) );
        }

        const token = crypto.randomBytes( 20 ).
            toString( "hex" );


        const date = new Date();
        date.setHours( date.getHours() + 1 );

        user.verifyAccountToken = token;
        user.verifyAccountExpires = date;
        user.save();

        const link = `${ this.serviceUrl }/verifyac/${ user.uid }/${ token }`;

        console.log( link )
        const dataObj = {
            to: user.email,
            subject: "Account Verification",
            type: "verifyAcMail",
            options: {
                link: link,
                uname: user.uname
            }
        };

        await Publish( 'mail', dataObj );

        return true;

    }


    async VerifyAcByLink(
        uid: UserDocument['uid'],
        token: UserDocument['verifyAccountToken'] ) {
        console.log( 'called' )
        const date = new Date();

        const user = await this.userRepo.getUsersAcVerificationToken( token, date );

        if ( !user ) {

            return false;
        }

        user.status = true;
        user.resetPasswordExpires = null;
        user.resetPasswordToken = null;
        user.save();


        const dataObj = {
            to: user.email,
            subject: "Account Verified SuccessFully",
            type: "verifyAcSuccess",
            options: {
                admin: 'Amit Patil',
                product: 'MyTube',
                uname: user.uname
            }
        };

        await Publish( 'mail', dataObj );
        return true;

    }


    async validateCredentials(
        email: UserDocument['email'],
        password: UserDocument['password']
    ) {

        const user = await this.userRepo.getUserByEmail( email );

        if ( !user || get( user, "acblock" ) ) {
            return ( new httpError.BadRequest( 'Invalid Credentials' ) );
        }


        if ( !get( user, "status" ) ) {
            return ( new httpError.BadRequest( 'Plz Verify Your  Account' ) );
        }

        const passCheck = await bcrypt.compare( password, user.password )
            .catch( ( e ) => false );


        if ( !passCheck ) {
            return ( new httpError.BadRequest( 'Invalid  Credentials' ) );
        }
        return omit( user, "password" );
    }

    async changePassword(
        email: UserDocument['email'],
        pass: string,
        newpass: string ) {

        const user = await this.userRepo.getUserByEmail( email );

        const passCheck = await bcrypt.compare( pass, user.password )
            .catch( ( e ) => false );


        if ( !passCheck ) {
            return ( new httpError.BadRequest( 'Old Password Does Not Match' ) );
        }

        let hash = await bcrypt.hash( newpass, 10 );

        user.password = hash;
        user.save();


        return true;
    }

    async forgetPassword( email: UserDocument['email'] ) {

        const user = await this.userRepo.getUserByEmail( email );

        if ( !user ) {
            return ( new httpError.BadRequest( 'No account with that email address found' ) );
        }

        const token = crypto.randomBytes( 20 ).
            toString( "hex" );


        const d1 = new Date();
        d1.setHours( d1.getHours() + 1 );

        user.resetPasswordToken = token;
        user.resetPasswordExpires = d1;
        user.save();

        const link = `${ this.baseUrl }/reset?token=${ token }`;

        const dataObj = {
            to: user.email,
            subject: "Reset Password",
            type: "resetpass",
            options: {
                link: link,
                uname: user.uname
            }
        };

        await Publish( 'mail', dataObj );
        return true;

    }

    async resetPassword( token: string, password: string ) {

        const date = new Date();

        const user = await this.userRepo.getUserByToken( token, date );

        if ( !user ) {
            return ( new httpError.BadRequest( 'Password reset token is invalid or has expired' ) );
        }


        let hash = await bcrypt.hash( password, 10 );

        user.password = hash;
        user.resetPasswordExpires = null;
        user.resetPasswordToken = null;
        user.save();


        const dataObj = {
            to: user.email,
            subject: "Welcome",
            type: "resetpassSuccess",
            options: {
                admin: 'Amit Patil',
                product: 'Socials',
                uname: user.uname
            }
        };

        await Publish( 'mail', dataObj );
        return true;

    }

    async loggedInUser( uid: UserDocument['uid'] ) {

        const user = await this.userRepo.getUserWithProfile( uid );

        if ( !user ) {
            return ( new httpError.BadRequest() );
        }
        return user;
    }
}