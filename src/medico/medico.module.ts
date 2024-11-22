/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MedicoEntity } from './medico.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicoService } from './medico.service';

@Module({
    imports: [TypeOrmModule.forFeature([MedicoEntity])],
    providers: [MedicoService],
})
export class MedicoModule {}
