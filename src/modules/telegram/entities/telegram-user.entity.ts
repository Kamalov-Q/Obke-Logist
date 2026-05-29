import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('telegram_users')
export class TelegramUser {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', unique: true })
    telegramId: string;

    @Column({ type: 'varchar', nullable: true })
    username: string | null;

    @Column({ type: 'varchar' })
    firstName: string;

    @Column({ type: 'varchar', nullable: true })
    lastName: string | null;

    @Column({ type: 'varchar', nullable: true })
    phoneNumber: string | null;

    @Column({ type: 'varchar', nullable: true })
    tempFullName: string | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
