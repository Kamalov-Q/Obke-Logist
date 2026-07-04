import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { WarehouseType } from '../enums/warehouse.enums';
import { ChiqimRecord } from './chiqim-record.entity';
import { ChiqimReceipt } from './chiqim-receipt.entity';
import { UzbDispatch, UzbTransfer, UzbKirimRecord, UzbChiqimRecord } from './uzb-logistics.entity';
import { KirimRecord } from './kirim-record.entity';

@Entity('warehouses')
export class Warehouse {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'text', nullable: true })
    address: string | null;

    @Column({ type: 'text', nullable: true })
    description: string | null;

    @Column({ type: 'enum', enum: WarehouseType, default: WarehouseType.CHINA })
    type: WarehouseType;

    @OneToMany(() => KirimRecord, (record) => record.warehouse)
    kirimRecords: KirimRecord[];

    @OneToMany(() => ChiqimRecord, (record) => record.warehouse)
    chiqimRecords: ChiqimRecord[];

    @OneToMany(() => ChiqimReceipt, (r) => r.warehouse)
    chiqimReceipts: ChiqimReceipt[];

    @OneToMany(() => UzbDispatch, (d) => d.warehouse)
    uzbDispatches: UzbDispatch[];

    @OneToMany(() => UzbTransfer, (t) => t.sourceWarehouse)
    outgoingTransfers: UzbTransfer[];

    @OneToMany(() => UzbTransfer, (t) => t.destWarehouse)
    incomingTransfers: UzbTransfer[];

    @OneToMany(() => UzbKirimRecord, (kr) => kr.warehouse)
    uzbKirimRecords: UzbKirimRecord[];

    @OneToMany(() => UzbChiqimRecord, (cr) => cr.warehouse)
    uzbChiqimRecords: UzbChiqimRecord[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
