import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Warehouse } from './warehouse.entity';
import { TaskStatus } from '../enums/warehouse.enums';
import { ChiqimRecord } from './chiqim-record.entity';
import { KirimProduct } from './kirim-product.entity';

@Entity('kirim_records')
export class KirimRecord {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    warehouseId: string;

    @ManyToOne(() => Warehouse, (wh) => wh.kirimRecords, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'warehouseId' })
    warehouse: Warehouse;

    @Column({ type: 'date' })
    date: Date;

    @Column({ type: 'varchar', length: 50 })
    clientCode: string;

    @Column({ type: 'varchar', length: 255 })
    clientName: string;

    @Column({ type: 'varchar', length: 50 })
    clientPhone: string;

    @Column({ type: 'text' })
    taskDescription: string;

    @Column({ type: 'varchar', length: 255 })
    assignedEmployeeName: string;

    @Column({ type: 'uuid', nullable: true })
    assignedEmployeeId: string | null;

    @Column({ type: 'date', nullable: true })
    taskDeadline: Date | null;

    @Column({ type: 'varchar', length: 10, nullable: true })
    taskNotifyAt: string | null;

    @Column({ type: 'text', nullable: true })
    taskNote: string | null;

    @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.PENDING })
    taskStatus: TaskStatus;

    @Column({ type: 'uuid', nullable: true })
    taskApiId: string | null;

    /** File metadata array [{name, type, size}] — no actual file content stored */
    @Column({ type: 'jsonb', default: [] })
    attachments: { name: string; type: string; size: number }[];

    /** Product IDs that have been fully dispatched */
    @Column({ type: 'jsonb', default: [] })
    dispatchedProductIds: string[];

    /** productId → number of places dispatched (partial chiqim tracking) */
    @Column({ type: 'jsonb', default: {} })
    dispatchedPlaces: Record<string, number>;

    @OneToMany(() => KirimProduct, (p) => p.kirimRecord, { cascade: true })
    products: KirimProduct[];

    @OneToMany(() => ChiqimRecord, (c) => c.kirimRecord)
    chiqimRecords: ChiqimRecord[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
