import { autoInjectable } from "tsyringe";
import httpError from 'http-errors';

import {
    NextFunction,
    Request,
    Response
} from "express";

import AdminService from "../services/admin.service";
import { get } from "lodash";


@autoInjectable()
export default class AdminController {

    private readonly adminService: AdminService;

    constructor(
        adminService: AdminService
    ) {
        this.adminService = adminService;
    }

    public getAllUsersSessions = async (
        req: Request,
        res: Response,
        next: NextFunction ) => {

        const data = await this.adminService.
            getAllUsersSessions();

        if ( !data || get( data, 'status' ) ) {
            return next( data );
        }

        return res.send( {
            status: 200,
            message: "success",
            data: data
        } )
    }

    public getAllUsersData = async (
        req: Request,
        res: Response,
        next: NextFunction ) => {

        const data = await this.adminService.
            getAllUsersData();

        if ( !data || get( data, 'status' ) ) {
            return next( data );
        }
        res.send( {
            status: 200,
            message: "success",
            data: data
        } )

    }

    public dashBoard = async (
        req: Request,
        res: Response,
        next: NextFunction ) => {

        const user = await this.adminService.
            getDashBoard();

        if ( !user ) {
            return res.send( {
                status: 400,
                message: "fail"
            } );
        }

        return res.send( {
            status: 200,
            message: "success",
            data: user
        } );

    }

    public BlockUser = async (
        req: Request,
        res: Response,
        next: NextFunction ) => {

        const uid = get( req, 'params.uid' );

        const user = await this.adminService.
            blockUser( uid );

        if ( !user ) {
            return res.send( {
                status: 400,
                message: "fail"
            } )
        }

        return res.send( {
            status: 200,
            message: "success"
        } )

    }

    public unBlockUser = async (
        req: Request,
        res: Response,
        next: NextFunction ) => {

        const uid = get( req, 'params.uid' );

        const user = await this.adminService.
            unBlockUser( uid );

        return res.send( {
            status: 200,
            message: "success"
        } )

    }

}