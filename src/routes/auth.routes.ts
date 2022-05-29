
import express, {
    Router,
    NextFunction,
    Request,
    Response
} from 'express';
import needle from 'needle';
import { get } from 'lodash';
import { container } from 'tsyringe';
import { dbdata } from '../db';


import {
    signupSchema,
    signinSchema,
    changepassSchema,
    forgetpassSchema,
    resetpassSchema
} from '../schema/user.schema';

import {
    updateSchema
} from '../schema/profile.schema';

import userController from '../controllers/user.controller';
import sessionController from '../controllers/session.controller';
import CommonMiddleware from "../middleware/common.middleware";



const router: Router = express.Router();

const UserController = container.resolve( userController );
const SessionController = container.resolve( sessionController );

const commonMiddleware = container.resolve( CommonMiddleware );

const {
    validateRequest,
    asyncHandler,
    requiresUser
} = commonMiddleware;


router.get( '/protected', commonMiddleware.requiresUser, async (
    req: Request,
    res: Response,
    next: NextFunction ) => {
    const user = get( req, "user" );
    res.send( user );
} );

router.post( '/signup',
    validateRequest( signupSchema ),
    asyncHandler( UserController.createAcHandler ) );

router.post( '/signin',
    validateRequest( signinSchema ),
    asyncHandler( SessionController.createUserSessionHandler ) );

router.delete( '/logout',
    requiresUser,
    asyncHandler( SessionController.invalidateUserSessionHandler ) );

router.get( '/loggedin',
    requiresUser,
    asyncHandler( UserController.curLoggedInUserHandler ) );


router.post( '/verifyLink',
    asyncHandler( UserController.sendAcVerifyLink ) );


router.get( '/verifyac/:uid/:token',
    asyncHandler( UserController.verifyAcByLink ) );


router.post( '/changepass',
    validateRequest( changepassSchema ),
    requiresUser,
    asyncHandler( UserController.changeAcPassHandler ) );

router.post( '/forgetpass',
    validateRequest( forgetpassSchema ),
    asyncHandler( UserController.forgotPassHandler ) );

router.post( '/reset/:token',
    validateRequest( resetpassSchema ),
    asyncHandler( UserController.resetPassHandler ) );


router.get( '/session',
    requiresUser,
    asyncHandler( SessionController.getUserSessionsHandler ) );


router.get( '/refresh',
    asyncHandler( SessionController.getRefreshTokenHandler ) );

router.get( '/data', requiresUser, asyncHandler( async ( req: Request, res: Response ) => {

    let uri = "https://jsonplaceholder.typicode.com/posts";

    needle.get( uri, function ( error, response ) {
        if ( !error && response.statusCode == 200 )
            //  console.log( response.body );
            return res.send( response.body );
    } );

    // res.send( 'hello' )

} ) );


router.get( '/posts', asyncHandler( async ( req: Request, res: Response ) => {
    res.send( dbdata );
} ) );

// export
export default router;