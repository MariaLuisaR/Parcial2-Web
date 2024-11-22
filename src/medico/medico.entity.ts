/* eslint-disable prettier/prettier */
import { PacienteEntity } from '../paciente/paciente.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
@Entity()
export class MedicoEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    specialty: string;

    @Column()
    phone: string;

    @ManyToMany(() => PacienteEntity, paciente => paciente.medicos)
    pacientes: PacienteEntity[];

}
