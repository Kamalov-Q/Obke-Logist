import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Warehouse } from './warehouse.entity';
import { KirimRecord } from './kirim-record.entity';
import { KirimProduct } from './kirim-product.entity';
import { ChiqimReceiptItem } from './chiqim-receipt.entity';
import { UzbDispatchItem, UzbTransferItem } from './uzb-logistics.entity';

@Entity('chiqim_records')
export class ChiqimRecord {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    warehouseId: string;

    @Column({ type: 'date' })
    date: Date;

    @Column({ type: 'varchar', length: 50 })
    clientCode: string;

    @Column({ type: 'varchar', length: 255 })
    clientName: string;

    @Column({ type: 'varchar', length: 50 })
    clientPhone: string;

    @Column({ type: 'uuid' })
    kirimRecordId: string;

    @Column({ type: 'varchar', length: 50 })
    vehicleNumber: string;

    /** Product IDs selected for this chiqim dispatch */
    @Column({ type: 'jsonb', default: [] })
    selectedProductIds: string[];

    @Column({ type: 'text', nullable: true })
    note: string | null;

    @ManyToOne(() => Warehouse, (w) => w.chiqimRecords, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'warehouseId' })
    warehouse: Warehouse;

    @ManyToOne(() => KirimRecord, (k) => k.chiqimRecords, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'kirimRecordId' })
    kirimRecord: KirimRecord;

    @OneToMany(() => ChiqimPhoto, (cp) => cp.chiqimRecord, { cascade: true })
    photos: ChiqimPhoto[];

    @OneToMany(() => ChiqimRecordProduct, (cr) => cr.chiqimRecord, { cascade: true })
    products: ChiqimRecordProduct[];

    @OneToMany(() => ChiqimReceiptItem, (cr) => cr.chiqimRecord)
    receiptItems: ChiqimReceiptItem[];

    @OneToMany(() => UzbDispatchItem, (cr) => cr.chiqimRecord)
    dispatchItems: UzbDispatchItem[];

    @OneToMany(() => UzbTransferItem, (cr) => cr.chiqimRecord)
    transferItems: UzbTransferItem[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

@Entity('chiqim_record_products')
export class ChiqimRecordProduct {
    @Column({ type: 'uuid', primary: true })
    chiqimRecordId: string;

    @Column({ type: 'uuid', primary: true })
    productId: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    placesDispatched: number;

    @ManyToOne(() => ChiqimRecord, (r) => r.products, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'chiqimRecordId' })
    chiqimRecord: ChiqimRecord;

    @ManyToOne(() => KirimProduct, (p) => p.chiqimItems, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'productId' })
    product: KirimProduct;
}

@Entity('chiqim_photos')
export class ChiqimPhoto {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    chiqimRecordId: string;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'text' })
    dataUrl: string;

    @ManyToOne(() => ChiqimRecord, (r) => r.photos, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'chiqimRecordId' })
    chiqimRecord: ChiqimRecord;

    @CreateDateColumn()
    createdAt: Date;
}
