
import express, {
    Router,
    NextFunction,
    Request,
    Response
} from 'express';

import { get } from 'lodash';
import { container } from 'tsyringe';

import adminController from '../controllers/admin.controller';
import CommonMiddleware from "../middleware/common.middleware";


const router: Router = express.Router();

const AdminController = container.resolve( adminController );
const commonMiddleware = container.resolve( CommonMiddleware );

const {
    validateRequest,
    asyncHandler,
    requiresUser
} = commonMiddleware;


router.get( '/sessions',
    asyncHandler( AdminController.getAllUsersSessions ) );

router.get( '/users',
    asyncHandler( AdminController.getAllUsersData ) );

router.get( '/block/:uid',
    asyncHandler( AdminController.BlockUser ) );

router.get( '/unblock/:uid',
    asyncHandler( AdminController.unBlockUser ) );

router.get( '/dashboard',
    asyncHandler( AdminController.dashBoard ) );


// export
export default router;


