
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    ManyToOne,
    JoinColumn
} from 'typeorm';

import { User } from './user.entity';

@Entity()
export class Session extends BaseEntity {

    @PrimaryGeneratedColumn()
    sid: number;

    @ManyToOne( () => User, user => user.sessions )
    @JoinColumn( { name: 'uid' } )
    uid: User['uid'];

    @Column( {
        type: "boolean",
        default: true
    } )
    valid: boolean;

    @Column()
    os: string;

    @Column()
    browser: string;

    @Column()
    ip4: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}