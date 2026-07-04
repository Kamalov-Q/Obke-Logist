import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Warehouse } from './warehouse.entity';
import { ChiqimRecord } from './chiqim-record.entity';

@Entity('uzb_dispatches')
export class UzbDispatch {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    uzbWarehouseId: string;

    @Column({ type: 'varchar', length: 50 })
    clientCode: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    clientName: string | null;

    @Column({ type: 'text', nullable: true })
    note: string | null;

    @Column({ type: 'date' })
    dispatchedAt: Date;

    @ManyToOne(() => Warehouse, (w) => w.uzbDispatches, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'uzbWarehouseId' })
    warehouse: Warehouse;

    @OneToMany(() => UzbDispatchItem, (i) => i.dispatch, { cascade: true })
    dispatchItems: UzbDispatchItem[];

    @CreateDateColumn()
    createdAt: Date;
}

@Entity('uzb_dispatch_items')
export class UzbDispatchItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    uzbDispatchId: string;

    @Column({ type: 'uuid' })
    chiqimRecordId: string;

    @Column({ type: 'decimal', precision: 5, scale: 4 })
    ratio: number;

    @ManyToOne(() => UzbDispatch, (d) => d.dispatchItems, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'uzbDispatchId' })
    dispatch: UzbDispatch;

    @ManyToOne(() => ChiqimRecord, (r) => r.dispatchItems, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'chiqimRecordId' })
    chiqimRecord: ChiqimRecord;
}

@Entity('uzb_transfers')
export class UzbTransfer {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    sourceWarehouseId: string;

    @Column({ type: 'uuid' })
    destWarehouseId: string;

    @Column({ type: 'varchar', length: 50 })
    clientCode: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    clientName: string | null;

    @Column({ type: 'text', nullable: true })
    note: string | null;

    @Column({ type: 'date' })
    transferredAt: Date;

    @ManyToOne(() => Warehouse, (w) => w.outgoingTransfers, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'sourceWarehouseId' })
    sourceWarehouse: Warehouse;

    @ManyToOne(() => Warehouse, (w) => w.incomingTransfers, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'destWarehouseId' })
    destWarehouse: Warehouse;

    @OneToMany(() => UzbTransferItem, (i) => i.transfer, { cascade: true })
    transferItems: UzbTransferItem[];

    @CreateDateColumn()
    createdAt: Date;
}

@Entity('uzb_transfer_items')
export class UzbTransferItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    uzbTransferId: string;

    @Column({ type: 'uuid' })
    chiqimRecordId: string;

    @Column({ type: 'decimal', precision: 5, scale: 4 })
    ratio: number;

    @ManyToOne(() => UzbTransfer, (t) => t.transferItems, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'uzbTransferId' })
    transfer: UzbTransfer;

    @ManyToOne(() => ChiqimRecord, (r) => r.transferItems, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'chiqimRecordId' })
    chiqimRecord: ChiqimRecord;
}

@Entity('uzb_kirim_records')
export class UzbKirimRecord {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    warehouseId: string;

    @Column({ type: 'date' })
    date: Date;

    @Column({ type: 'varchar', length: 255 })
    productName: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    quantity: number;

    @Column({ type: 'varchar', length: 50 })
    unit: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    weight: number | null;

    @Column({ type: 'varchar', length: 20, nullable: true })
    weightUnit: string | null;

    @Column({ type: 'text', nullable: true })
    note: string | null;

    @ManyToOne(() => Warehouse, (w) => w.uzbKirimRecords, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'warehouseId' })
    warehouse: Warehouse;

    @CreateDateColumn()
    createdAt: Date;
}

@Entity('uzb_chiqim_records')
export class UzbChiqimRecord {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    warehouseId: string;

    @Column({ type: 'date' })
    date: Date;

    @Column({ type: 'varchar', length: 50 })
    clientCode: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    clientName: string | null;

    @Column({ type: 'varchar', length: 50, nullable: true })
    clientPhone: string | null;

    @Column({ type: 'varchar', length: 255 })
    productName: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    quantity: number;

    @Column({ type: 'varchar', length: 50 })
    unit: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    weight: number | null;

    @Column({ type: 'varchar', length: 20, nullable: true })
    weightUnit: string | null;

    @Column({ type: 'text', nullable: true })
    note: string | null;

    @ManyToOne(() => Warehouse, (w) => w.uzbChiqimRecords, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'warehouseId' })
    warehouse: Warehouse;

    @CreateDateColumn()
    createdAt: Date;
}
