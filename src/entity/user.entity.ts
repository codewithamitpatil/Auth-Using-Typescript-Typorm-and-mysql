
import config from 'config';
import bcrypt from 'bcrypt';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    BaseEntity,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,

} from "typeorm";

import { Session } from "./session.entity";
import { Role } from "../constant/role.constant";


@Entity()
export class User extends BaseEntity {


    @PrimaryGeneratedColumn()
    uid: number;

    @Column( {
        unique: true
    } )
    uname: string;

    @Column( {
        unique: true
    } )
    email: string;

    @Column()
    password: string;

    @Column( {
        type: "enum",
        enum: Role,
        default: Role.USER
    } )
    role: string;

    @Column( {
        type: "boolean",
        default: false
    } )
    status: boolean;

    @Column( {
        type: "boolean",
        default: false
    } )
    acblock: boolean;

    @Column( {
        type: "text",
        default: null
    } )
    resetPasswordToken: string;


    @Column( {
        type: "text",
        default: null
    } )
    resetPasswordExpires: Date;


    @Column( {
        type: "text",
        default: null
    } )
    verifyAccountToken: string;

    @Column( {
        type: "text",
        default: null
    } )
    verifyAccountExpires: Date;


    @OneToMany( () => Session, session => session.uid )
    sessions: Session[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;



}
