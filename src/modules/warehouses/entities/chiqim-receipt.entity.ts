import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Warehouse } from './warehouse.entity';
import { ChiqimRecord } from './chiqim-record.entity';

@Entity('chiqim_receipts')
export class ChiqimReceipt {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    uzbWarehouseId: string;

    @Column({ type: 'varchar', length: 50 })
    vehicleNumber: string;

    @Column({ type: 'text', nullable: true })
    note: string | null;

    @Column({ type: 'date' })
    receivedAt: Date;

    @ManyToOne(() => Warehouse, (w) => w.chiqimReceipts, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'uzbWarehouseId' })
    warehouse: Warehouse;

    @OneToMany(() => ChiqimReceiptItem, (item) => item.receipt, { cascade: true })
    receivedItems: ChiqimReceiptItem[];

    @CreateDateColumn()
    createdAt: Date;
}

@Entity('chiqim_receipt_items')
export class ChiqimReceiptItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    chiqimReceiptId: string;

    @Column({ type: 'uuid' })
    chiqimRecordId: string;

    @Column({ type: 'decimal', precision: 5, scale: 4 })
    receivedRatio: number;

    @ManyToOne(() => ChiqimReceipt, (r) => r.receivedItems, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'chiqimReceiptId' })
    receipt: ChiqimReceipt;

    @ManyToOne(() => ChiqimRecord, (r) => r.receiptItems, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'chiqimRecordId' })
    chiqimRecord: ChiqimRecord;
}
