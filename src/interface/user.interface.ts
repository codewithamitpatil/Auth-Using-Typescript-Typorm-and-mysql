
export interface UserDocument {
    uid: number;
    uname: string;
    email: string;
    password?: string;
    role?: string;
    status?: boolean;
    resetPasswordExpires?: any;
    resetPasswordToken?: string;
    verifyAccountExpires?: any;
    verifyAccountToken?: string;
}