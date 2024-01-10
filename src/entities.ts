import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true,
        nullable: true,
    })
    publicKey: string;

    @Column()
    sign: string;

    @Column({
        nullable: true
    })
    phone: string;

    @Column({
        nullable: true
    })
    email: string;
}
