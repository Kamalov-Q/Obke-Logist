import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Warehouse } from './entities/warehouse.entity';
import { KirimRecord } from './entities/kirim-record.entity';
import { KirimProduct, KirimProductPlace, KirimProductMeasurement } from './entities/kirim-product.entity';
import { ChiqimRecord, ChiqimRecordProduct, ChiqimPhoto } from './entities/chiqim-record.entity';
import { ChiqimReceipt, ChiqimReceiptItem } from './entities/chiqim-receipt.entity';
import { UzbDispatch, UzbDispatchItem, UzbTransfer, UzbTransferItem, UzbKirimRecord, UzbChiqimRecord } from './entities/uzb-logistics.entity';
import { WarehousesController } from './warehouses.controller';
import { WarehousesService } from './warehouses.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Warehouse,
            KirimRecord,
            KirimProduct,
            KirimProductPlace,
            KirimProductMeasurement,
            ChiqimRecord,
            ChiqimRecordProduct,
            ChiqimPhoto,
            ChiqimReceipt,
            ChiqimReceiptItem,
            UzbDispatch,
            UzbDispatchItem,
            UzbTransfer,
            UzbTransferItem,
            UzbKirimRecord,
            UzbChiqimRecord
        ])
    ],
    controllers: [WarehousesController],
    providers: [WarehousesService],
    exports: [WarehousesService]
})
export class WarehousesModule {}
