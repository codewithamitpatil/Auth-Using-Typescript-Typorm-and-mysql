import { get } from 'lodash';
import { FilterQuery, getConnection } from 'typeorm';
import { autoInjectable } from 'tsyringe';


import { User } from "../entity/user.entity";
import { UserDocument } from "../interface/user.interface";
import { SessionDocument } from '../interface/session.interface';
import { Session } from '../entity/session.entity';

@autoInjectable()
export default class AdminRepository {

    private readonly session_model = Session;
    private readonly user_model = User;


    async getUserSessions() {
        return await getConnection().
            getRepository( Session ).
            query( 'SELECT * FROM session  LEFT JOIN profile ON session.uid = profile.uid' )
            ;
    }

    async getUserData() {
        return await getConnection().
            getRepository( User ).
            query( 'SELECT * FROM user  LEFT JOIN profile ON user.uid = profile.uid' )
            ;
    }

    async BlockUser( uid: UserDocument['uid'] ) {
        return await this.user_model.
            update( { uid }, { acblock: true } );
    }

    async unBlockUser( uid: UserDocument['uid'] ) {
        return await this.user_model.
            update( { uid }, { acblock: false } );
    }

    async totalUser() {
        const users = await getConnection().
            getRepository( User ).
            createQueryBuilder().
            getCount();
        const session = await getConnection().
            getRepository( Session ).
            createQueryBuilder().
            where( "session.valid = :condition", { condition: true } ).
            getCount();
        return {
            total_user: users,
            active_user: session
        };

    }

}

