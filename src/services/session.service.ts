import { autoInjectable } from "tsyringe";
import { SessionDocument } from "../interface/session.interface";
import { UserDocument } from "../interface/user.interface";

import SessionRepository from "../repository/session.repository";
import { UserRepository } from "../repository/user.repository";


@autoInjectable()
export default class SessionService {

    private readonly sessionRepo: SessionRepository;
    private readonly userRepo: UserRepository;

    constructor(
        sessionRepo: SessionRepository,
        userRepo: UserRepository
    ) {
        this.sessionRepo = sessionRepo;
        this.userRepo = userRepo;
    }

    async create( session: SessionDocument ) {
        return await this.sessionRepo.createSession( session );
    }

    async update(
        sid: SessionDocument['sid'],
        update: SessionDocument ) {
        return await this.sessionRepo.updateSession( sid, update );
    }

    async get( uid: UserDocument['uid'] ) {
        return await this.sessionRepo.getSession( { uid } );
    }

    async getAll( uid: UserDocument['uid'] ) {
        return await this.sessionRepo.getSessions( { uid, valid: true } );
    }

    async remove( uid: UserDocument['uid'] ) {
        return await this.sessionRepo.deleteSession( { uid } );
    }

}