/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { DiagnosticoEntity } from './diagnostico.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
    BusinessError,
    BusinessLogicException,
  } from '../shared/errors/business-errors';

@Injectable()
export class DiagnosticoService {
    constructor(
        @InjectRepository(DiagnosticoEntity)
        private readonly diagnosticoRepository: Repository<DiagnosticoEntity>,
    ) {}

    async findAll(): Promise<DiagnosticoEntity[]> {
        return await this.diagnosticoRepository.find({ relations: ["pacientes"] });
    }

    async findOne(id: string): Promise<DiagnosticoEntity> {
        const diagnostico: DiagnosticoEntity = await this.diagnosticoRepository.findOne({where: {id}, relations: ["pacientes"] } );
        if (!diagnostico)
          throw new BusinessLogicException("The diagnostico with the given id was not found", BusinessError.NOT_FOUND);
   
        return diagnostico;
    }

    async create(diagnostico: DiagnosticoEntity): Promise<DiagnosticoEntity> {
        if (diagnostico.description.length > 200) {
            throw new BusinessLogicException(
                "The description length must be equal or less than 200 characters",
                BusinessError.PRECONDITION_FAILED
            );
        }
        return await this.diagnosticoRepository.save(diagnostico);
    }

    async delete(id: string) {
        const diagnostico: DiagnosticoEntity = await this.diagnosticoRepository.findOne({where:{id}});
        if (!diagnostico)
          throw new BusinessLogicException("The diagnostico with the given id was not found", BusinessError.NOT_FOUND);
     
        await this.diagnosticoRepository.remove(diagnostico);
    }

}


