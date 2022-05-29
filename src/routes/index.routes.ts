
import express, {
    Express,
    Router,
    Request,
    Response,
    NextFunction
} from 'express';
import { container } from 'tsyringe';

import CommonMiddleware from "../middleware/common.middleware";
import { NotFoundPage } from '../controllers/error.controller';


import authRoutes from './auth.routes';
import adminRoutes from './admin.routes';

const router: Router = express.Router();

const commonMiddleware = container.resolve( CommonMiddleware );
const {
    validateRequest,
    asyncHandler,
    requiresUser,
    deserializeUser,
    requiresAdmin,
    errorHandler
} = commonMiddleware;



router.use( deserializeUser );


router.get( '/health', async ( req: Request, res: Response ) => {
    res.send( 'Auth Service is up and running' )
} );

router.use( '', authRoutes );
router.use( '/admin', requiresAdmin, adminRoutes );


// 404 wild card route
router.use( '*', NotFoundPage );

// centrlize error handler
router.use( errorHandler );

// export
export default router;
