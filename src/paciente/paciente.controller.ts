/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Delete, Body, Param, UseInterceptors } from '@nestjs/common';
import { PacienteService } from './paciente.service';
import { PacienteEntity } from './paciente.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';

@Controller('pacientes')
@UseInterceptors(BusinessErrorsInterceptor)
export class PacienteController {
  constructor(private readonly pacienteService: PacienteService) {}

  @Get()
  async findAll() {
    return await this.pacienteService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.pacienteService.findOne(id);
  }

  @Post()
  async create(@Body() paciente: PacienteEntity) {
    return await this.pacienteService.create(paciente);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.pacienteService.delete(id);
  }
}
