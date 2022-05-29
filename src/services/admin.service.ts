
import { autoInjectable } from "tsyringe";
import { get, omit } from 'lodash';
import httpError from 'http-errors';
import crypto from 'crypto';
import config from 'config';



import AdminRepository from "../repository/admin.repository";
import { UserDocument } from "../interface/user.interface";


@autoInjectable()
export default class AdminService {

    private readonly adminRepo: AdminRepository;

    constructor(
        adminRepo: AdminRepository
    ) {
        this.adminRepo = adminRepo;
    }

    async getAllUsersSessions() {
        const user = await this.adminRepo.
            getUserSessions();
        return user;
    }

    async getAllUsersData() {
        const user = await this.adminRepo.
            getUserData();
        return user;
    }

    async blockUser( uid: UserDocument['uid'] ) {
        const user = await this.adminRepo.
            BlockUser( uid );
        return user;
    }

    async unBlockUser( uid: UserDocument['uid'] ) {
        const user = await this.adminRepo.
            unBlockUser( uid );
        return user;
    }

    async getDashBoard() {
        return this.adminRepo.totalUser();
    }
}