import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Warehouse } from './entities/warehouse.entity';
import { KirimRecord } from './entities/kirim-record.entity';
import { ChiqimRecord } from './entities/chiqim-record.entity';

@Injectable()
export class WarehousesService {
    constructor(
        @InjectRepository(Warehouse) private readonly warehouseRepo: Repository<Warehouse>,
        @InjectRepository(KirimRecord) private readonly kirimRepo: Repository<KirimRecord>,
        @InjectRepository(ChiqimRecord) private readonly chiqimRepo: Repository<ChiqimRecord>
    ) {}

    async findAllWarehouses(): Promise<Warehouse[]> {
        return this.warehouseRepo.find({ order: { createdAt: 'DESC' } });
    }

    async createWarehouse(dto: Partial<Warehouse>): Promise<Warehouse> {
        const wh = this.warehouseRepo.create(dto);
        return this.warehouseRepo.save(wh);
    }

    async updateWarehouse(id: string, dto: Partial<Warehouse>): Promise<Warehouse> {
        await this.warehouseRepo.update(id, dto);
        return this.warehouseRepo.findOneOrFail({ where: { id } });
    }

    async deleteWarehouse(id: string): Promise<void> {
        await this.warehouseRepo.delete(id);
    }

    async getKirimRecords(warehouseId: string): Promise<KirimRecord[]> {
        return this.kirimRepo.find({
            where: { warehouseId },
            relations: ['products', 'products.places', 'products.measurements'],
            order: { createdAt: 'DESC' }
        });
    }

    async createKirimRecord(warehouseId: string, dto: any): Promise<KirimRecord> {
        // Sanitize string decimals from frontend like "0.04 m³"
        if (dto.products && Array.isArray(dto.products)) {
            dto.products = dto.products.map(p => {
                const parseNum = (val: any) => typeof val === 'string' ? parseFloat(val.replace(/[^\d.-]/g, '')) || 0 : val;
                return {
                    ...p,
                    quantity: parseNum(p.quantity),
                    width: parseNum(p.width),
                    length: parseNum(p.length),
                    height: parseNum(p.height),
                    totalVolume: parseNum(p.totalVolume),
                    brutto: parseNum(p.brutto),
                    netto: parseNum(p.netto),
                    places: Array.isArray(p.places) ? p.places.map((pl: any) => ({ ...pl, count: parseNum(pl.count) })) : p.places,
                };
            });
        }
        
        const record = this.kirimRepo.create({
            ...dto,
            warehouseId,
        } as Partial<KirimRecord>);
        return this.kirimRepo.save(record);
    }

    async deleteKirimRecord(id: string): Promise<void> {
        await this.kirimRepo.delete(id);
    }

    async updateKirimStatus(id: string, status: string): Promise<void> {
        await this.kirimRepo.update(id, { taskStatus: status } as any);
    }

    async updateDispatchedPlaces(kirimId: string, productId: string, placesCount: number, totalPlaces: number): Promise<void> {
        const record = await this.kirimRepo.findOneOrFail({ where: { id: kirimId } });
        const prev = (record.dispatchedPlaces ?? {})[productId] ?? 0;
        const next = prev + placesCount;
        const newDispatchedPlaces = { ...(record.dispatchedPlaces ?? {}), [productId]: next };
        const newDispatchedIds = [...(record.dispatchedProductIds ?? [])];
        if (next >= totalPlaces && !newDispatchedIds.includes(productId)) {
            newDispatchedIds.push(productId);
        }
        await this.kirimRepo.update(kirimId, { dispatchedPlaces: newDispatchedPlaces, dispatchedProductIds: newDispatchedIds });
    }

    async markProductsDispatched(kirimRecordId: string, productIds: string[]): Promise<void> {
        const record = await this.kirimRepo.findOneOrFail({ where: { id: kirimRecordId } });
        const prev = record.dispatchedProductIds ?? [];
        const next = Array.from(new Set([...prev, ...productIds]));
        await this.kirimRepo.update(kirimRecordId, { dispatchedProductIds: next });
    }

    async getAllKirimRecords(): Promise<KirimRecord[]> {
        return this.kirimRepo.find({
            relations: ['products', 'products.places', 'products.measurements'],
            order: { createdAt: 'DESC' }
        });
    }

    // --- Chiqim ---
    async getChiqimRecords(warehouseId: string): Promise<ChiqimRecord[]> {
        return this.chiqimRepo.find({
            where: { warehouseId },
            relations: ['products', 'photos'],
            order: { createdAt: 'DESC' }
        });
    }

    async getAllChiqimRecords(): Promise<ChiqimRecord[]> {
        return this.chiqimRepo.find({
            relations: ['products', 'photos'],
            order: { createdAt: 'DESC' }
        });
    }

    async createChiqimRecord(warehouseId: string, dto: any): Promise<ChiqimRecord> {
        const record = this.chiqimRepo.create({
            ...dto,
            warehouseId,
        } as Partial<ChiqimRecord>);
        return this.chiqimRepo.save(record);
    }

    async deleteChiqimRecord(id: string): Promise<void> {
        await this.chiqimRepo.delete(id);
    }
}
