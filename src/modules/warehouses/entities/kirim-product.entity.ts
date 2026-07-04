import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { KirimRecord } from './kirim-record.entity';
import { VolumeMode } from '../enums/warehouse.enums';
import { ChiqimRecordProduct } from './chiqim-record.entity';

@Entity('kirim_products')
export class KirimProduct {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    kirimRecordId: string;

    @ManyToOne(() => KirimRecord, (r) => r.products, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'kirimRecordId' })
    kirimRecord: KirimRecord;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    quantity: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    width: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    length: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    height: number;

    @Column({ type: 'varchar', length: 20 })
    dimensionUnit: string;

    @Column({ type: 'enum', enum: VolumeMode, default: VolumeMode.PLACES })
    volumeMode: VolumeMode;

    @Column({ type: 'decimal', precision: 10, scale: 6 })
    totalVolume: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    brutto: number;

    @Column({ type: 'varchar', length: 20 })
    bruttoUnit: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    netto: number;

    @Column({ type: 'varchar', length: 20 })
    nettoUnit: string;

    @Column({ type: 'text', nullable: true })
    note: string | null;

    @OneToMany(() => KirimProductPlace, (p) => p.product, { cascade: true })
    places: KirimProductPlace[];

    @OneToMany(() => KirimProductMeasurement, (m) => m.product, { cascade: true })
    measurements: KirimProductMeasurement[];

    @OneToMany(() => ChiqimRecordProduct, (cr) => cr.product, { cascade: true })
    chiqimItems: ChiqimRecordProduct[];

    @CreateDateColumn()
    createdAt: Date;
}

@Entity('kirim_product_places')
export class KirimProductPlace {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    productId: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    count: number;

    @Column({ type: 'varchar', length: 50 })
    unit: string;

    @ManyToOne(() => KirimProduct, (p) => p.places, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'productId' })
    product: KirimProduct;
}

@Entity('kirim_product_measurements')
export class KirimProductMeasurement {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    productId: string;

    @Column({ type: 'text' })
    value: string;

    @Column({ type: 'varchar', length: 50 })
    unit: string;

    @ManyToOne(() => KirimProduct, (p) => p.measurements, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'productId' })
    product: KirimProduct;
}
