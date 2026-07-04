import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { WarehousesService } from './warehouses.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Warehouses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('warehouses')
export class WarehousesController {
    constructor(private readonly warehousesService: WarehousesService) {}

    @Get()
    @ApiOperation({ summary: 'List all warehouses' })
    findAll() {
        return this.warehousesService.findAllWarehouses();
    }

    @Post()
    @ApiOperation({ summary: 'Create a warehouse' })
    create(@Body() dto: any) {
        return this.warehousesService.createWarehouse(dto);
    }

    // ── Static routes MUST come before :id parameterized routes ──

    @Get('kirim/all')
    @ApiOperation({ summary: 'List all Kirim records globally' })
    getAllKirimRecords() {
        return this.warehousesService.getAllKirimRecords();
    }

    @Get('chiqim/all')
    @ApiOperation({ summary: 'List all Chiqim records globally' })
    getAllChiqimRecords() {
        return this.warehousesService.getAllChiqimRecords();
    }

    @Delete('kirim/:recordId')
    @ApiOperation({ summary: 'Delete a kirim record' })
    removeKirimRecord(@Param('recordId') recordId: string) {
        return this.warehousesService.deleteKirimRecord(recordId);
    }

    @Patch('kirim/:recordId/status')
    @ApiOperation({ summary: 'Update kirim task status' })
    updateKirimStatus(@Param('recordId') recordId: string, @Body() dto: { status: string }) {
        return this.warehousesService.updateKirimStatus(recordId, dto.status);
    }

    @Patch('kirim/:recordId/dispatch-places')
    @ApiOperation({ summary: 'Update dispatched places for a product' })
    updateDispatchedPlaces(@Param('recordId') recordId: string, @Body() dto: { productId: string; placesCount: number; totalPlaces: number }) {
        return this.warehousesService.updateDispatchedPlaces(recordId, dto.productId, dto.placesCount, dto.totalPlaces);
    }

    @Patch('kirim/:recordId/mark-dispatched')
    @ApiOperation({ summary: 'Mark products as dispatched' })
    markProductsDispatched(@Param('recordId') recordId: string, @Body() dto: { productIds: string[] }) {
        return this.warehousesService.markProductsDispatched(recordId, dto.productIds);
    }

    @Delete('chiqim/:recordId')
    @ApiOperation({ summary: 'Delete a chiqim record' })
    removeChiqimRecord(@Param('recordId') recordId: string) {
        return this.warehousesService.deleteChiqimRecord(recordId);
    }

    // ── Parameterized :id routes ──

    @Patch(':id')
    @ApiOperation({ summary: 'Update a warehouse' })
    update(@Param('id') id: string, @Body() dto: any) {
        return this.warehousesService.updateWarehouse(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a warehouse' })
    remove(@Param('id') id: string) {
        return this.warehousesService.deleteWarehouse(id);
    }

    @Get(':id/kirim')
    @ApiOperation({ summary: 'List Kirim records for warehouse' })
    getKirimRecords(@Param('id') id: string) {
        return this.warehousesService.getKirimRecords(id);
    }

    @Post(':id/kirim')
    @ApiOperation({ summary: 'Create Kirim record' })
    createKirimRecord(@Param('id') id: string, @Body() dto: any) {
        return this.warehousesService.createKirimRecord(id, dto);
    }

    @Get(':id/chiqim')
    @ApiOperation({ summary: 'List Chiqim records' })
    getChiqimRecords(@Param('id') id: string) {
        return this.warehousesService.getChiqimRecords(id);
    }

    @Post(':id/chiqim')
    @ApiOperation({ summary: 'Create Chiqim record' })
    createChiqimRecord(@Param('id') id: string, @Body() dto: any) {
        return this.warehousesService.createChiqimRecord(id, dto);
    }
}
