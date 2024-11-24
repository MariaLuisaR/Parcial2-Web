/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Delete, Body, Param, UseInterceptors } from '@nestjs/common';
import { DiagnosticoService } from './diagnostico.service';
import { DiagnosticoEntity } from './diagnostico.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';

@Controller('diagnosticos')
@UseInterceptors(BusinessErrorsInterceptor)
export class DiagnosticoController {
  constructor(private readonly diagnosticoService: DiagnosticoService) {}

  @Get()
  async findAll() {
    return await this.diagnosticoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.diagnosticoService.findOne(id);
  }

  @Post()
  async create(@Body() diagnostico: DiagnosticoEntity) {
    return await this.diagnosticoService.create(diagnostico);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.diagnosticoService.delete(id);
  }
}
