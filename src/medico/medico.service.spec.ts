/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { MedicoService } from './medico.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MedicoEntity } from './medico.entity';

describe('MedicoService', () => {
  let service: MedicoService;
  let repository: Repository<MedicoEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MedicoService,
        {
          provide: getRepositoryToken(MedicoEntity),
          useClass: Repository, 
        },
      ],
    }).compile();

    service = module.get<MedicoService>(MedicoService);
    repository = module.get<Repository<MedicoEntity>>(
      getRepositoryToken(MedicoEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined(); 
  });
});
