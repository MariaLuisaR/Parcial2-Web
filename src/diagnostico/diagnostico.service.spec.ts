/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { DiagnosticoService } from './diagnostico.service';
import { DiagnosticoEntity } from './diagnostico.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BusinessError } from '../shared/errors/business-errors';
import { faker } from '@faker-js/faker';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const mockRepository = (): MockRepository => ({
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
});

describe('DiagnosticoService', () => {
  let service: DiagnosticoService;
  let repository: MockRepository<DiagnosticoEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiagnosticoService,
        {
          provide: getRepositoryToken(DiagnosticoEntity),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    service = module.get<DiagnosticoService>(DiagnosticoService);
    repository = module.get<MockRepository<DiagnosticoEntity>>(getRepositoryToken(DiagnosticoEntity));
  });

  describe('findAll', () => {
    it('should return all diagnosticos', async () => {
      const diagnosticos = [
        {
          id: "",
          name: faker.person.fullName(),
          description: faker.lorem.sentence(),
          pacientes: [],
        },
      ];
      repository.find.mockResolvedValue(diagnosticos);

      const result = await service.findAll();
      expect(result).toEqual(diagnosticos);
      expect(repository.find).toHaveBeenCalledWith({ relations: ['pacientes'] });
    });
  });

  describe('findOne', () => {
    it('should return a diagnostico by id', async () => {
      const diagnostico = {
        id: "",
        name: faker.person.fullName(),
        description: faker.lorem.sentence(),
        pacientes: [],
      };
      repository.findOne.mockResolvedValue(diagnostico);

      const result = await service.findOne(diagnostico.id);
      expect(result).toEqual(diagnostico);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: diagnostico.id },
        relations: ['pacientes'],
      });
    });

    it('should throw an exception if diagnostico not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne("")).rejects.toMatchObject({
        message: "The diagnostico with the given id was not found",
        type: BusinessError.NOT_FOUND,
      });
    });
  });

  describe('create', () => {
    it('should create and return a diagnostico', async () => {
      const diagnostico = {
        id: "",
        name: faker.person.fullName(),
        description: faker.lorem.sentence(),
        pacientes: [],
      };
      repository.save.mockResolvedValue(diagnostico);

      const result = await service.create(diagnostico as DiagnosticoEntity);
      expect(result).toEqual(diagnostico);
      expect(repository.save).toHaveBeenCalledWith(diagnostico);
    });

    it('should throw an exception if description is too long', async () => {
      const diagnostico = {
        id: "",
        name: faker.person.fullName(),
        description: "According to all known laws of aviation, there is no way a bee should be able to fly. Its wings are too small to get its fat little body off the ground. The bee, of course, flies anyway because bees don't care what humans think is impossible.",
        pacientes: [],
      };

      await expect(service.create(diagnostico as DiagnosticoEntity)).rejects.toMatchObject({
        message: "The description length must be equal or less than 200 characters",
        type: BusinessError.PRECONDITION_FAILED,
      });
    });
  });

  describe('delete', () => {
    it('should delete a diagnostico', async () => {
      const diagnostico = {
        id: "",
        name: faker.person.fullName(),
        description: faker.lorem.sentence(),
        pacientes: [],
      };
      repository.findOne.mockResolvedValue(diagnostico);
      repository.remove.mockResolvedValue(null);

      await service.delete(diagnostico.id);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: diagnostico.id } });
      expect(repository.remove).toHaveBeenCalledWith(diagnostico);
    });

    it('should throw an exception if diagnostico not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.delete("")).rejects.toMatchObject({
        message: "The diagnostico with the given id was not found",
        type: BusinessError.NOT_FOUND,
      });
    });

  });
});
