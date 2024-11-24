/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Delete, Body, Param, UseInterceptors } from '@nestjs/common';
import { MedicoService } from './medico.service';
import { MedicoEntity } from './medico.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';

@Controller('medicos')
@UseInterceptors(BusinessErrorsInterceptor)
export class MedicoController {
  constructor(private readonly medicoService: MedicoService) {}

  @Get()
  async findAll() {
    return await this.medicoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.medicoService.findOne(id);
  }

  @Post()
  async create(@Body() medico: MedicoEntity) {
    return await this.medicoService.create(medico);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.medicoService.delete(id);
  }
}
