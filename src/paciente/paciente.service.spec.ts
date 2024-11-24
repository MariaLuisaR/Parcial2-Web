/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { PacienteService } from './paciente.service';
import { PacienteEntity } from './paciente.entity';
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

describe('PacienteService', () => {
  let service: PacienteService;
  let repository: MockRepository<PacienteEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PacienteService,
        {
          provide: getRepositoryToken(PacienteEntity),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    service = module.get<PacienteService>(PacienteService);
    repository = module.get<MockRepository<PacienteEntity>>(getRepositoryToken(PacienteEntity));
  });

  describe('findAll', () => {
    it('should return all pacientes', async () => {
      const pacientes = [
        {
          id: "",
          name: faker.person.fullName(),
          diagnosticos: [],
          medicos: [],
        },
      ];
      repository.find.mockResolvedValue(pacientes);

      const result = await service.findAll();
      expect(result).toEqual(pacientes);
      expect(repository.find).toHaveBeenCalledWith({ relations: ['diagnosticos', 'medicos'] });
    });
  });

  describe('findOne', () => {
    it('should return a paciente by id', async () => {
      const paciente = {
        id: "",
        name: faker.person.fullName(),
        diagnosticos: [],
        medicos: [],
      };
      repository.findOne.mockResolvedValue(paciente);

      const result = await service.findOne(paciente.id);
      expect(result).toEqual(paciente);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: paciente.id },
        relations: ['diagnosticos', 'medicos'],
      });
    });

    it('should throw an exception if paciente not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne("")).rejects.toMatchObject({
        message: "The paciente with the given id was not found",
        type: BusinessError.NOT_FOUND,
      });
    });
  });

  describe('create', () => {
    it('should create and return a paciente', async () => {
      const paciente = {
        id: "",
        name: faker.person.fullName(),
        diagnosticos: [],
        medicos: [],
      };
      repository.save.mockResolvedValue(paciente);

      const result = await service.create(paciente as PacienteEntity);
      expect(result).toEqual(paciente);
      expect(repository.save).toHaveBeenCalledWith(paciente);
    });

    it('should throw an exception if name is invalid', async () => {
      const paciente = {
        id: "",
        name: "A",
        diagnosticos: [],
        medicos: [],
      };

      await expect(service.create(paciente as PacienteEntity)).rejects.toMatchObject({
        message: "The name of the paciente must be longer than three characters",
        type: BusinessError.BAD_REQUEST,
      });
    });
  });

  describe('delete', () => {
    it('should delete a paciente', async () => {
      const paciente = {
        id: "",
        name: faker.person.fullName(),
        diagnosticos: [],
      };
      repository.findOne.mockResolvedValue(paciente);
      repository.remove.mockResolvedValue(null);

      await service.delete(paciente.id);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: paciente.id } });
      expect(repository.remove).toHaveBeenCalledWith(paciente);
    });

    it('should throw an exception if paciente not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.delete("")).rejects.toMatchObject({
        message: "The paciente with the given id was not found",
        type: BusinessError.NOT_FOUND,
      });
    });

    it('should throw an exception if paciente has diagnosticos', async () => {
      const paciente = {
        id: "",
        name: faker.person.fullName(),
        diagnosticos: [{ id: "", name: 'Diagnostico1' }],
      };
      repository.findOne.mockResolvedValue(paciente);

      await expect(service.delete(paciente.id)).rejects.toMatchObject({
        message: "Patients with diagnoses cannot be deleted",
        type: BusinessError.BAD_REQUEST,
      });
    });
  });
});
