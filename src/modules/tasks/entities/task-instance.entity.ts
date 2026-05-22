import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TaskTemplate } from "./task-template.entity";
import { TaskStatus } from "../enums/task-status.enum";

@Entity('task_instances')
export class TaskInstance {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    templateId: string;

    @ManyToOne(() => TaskTemplate)
    @JoinColumn({ name: 'templateId' })
    template: TaskTemplate;

    @Index()
    @Column()
    assignedTo: string;

    @Column({
        type: 'enum',
        enum: TaskStatus,
        default: TaskStatus.TODO
    })
    status: TaskStatus;

    @Column({ type: 'date' })
    dueDate: Date;

    @Column({ type: 'timestamp' })
    expiresAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ type: 'text', nullable: true })
    completionDescription?: string;

    @Column({ type: 'text', nullable: true })
    completionLink?: string;

    @Column({ type: 'text', nullable: true })
    rejectionReason?: string;

    @Column({ type: 'timestamp', nullable: true })
    completedAt?: Date;

    @Column({ type: 'timestamp', nullable: true })
    approvedAt?: Date;


}