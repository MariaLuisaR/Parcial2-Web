/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PacienteService } from './paciente.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PacienteEntity } from './paciente.entity';

@Module({
    imports: [TypeOrmModule.forFeature([PacienteEntity])],
    providers: [PacienteService],
})
export class PacienteModule {}