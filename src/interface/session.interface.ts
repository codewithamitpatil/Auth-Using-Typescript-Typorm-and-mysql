
import { UserDocument } from "./user.interface";

export interface SessionDocument {
    sid?: number;
    uid?: UserDocument['uid'];
    valid?: boolean;
    os?: string;
    ip4?: string;
    browser?: string;
    createdAt?: Date;
    updatedAt?: Date;
}