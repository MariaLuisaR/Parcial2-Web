/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DiagnosticoModule } from './diagnostico/diagnostico.module';
import { PacienteModule } from './paciente/paciente.module';
import { DiagnosticoEntity } from './diagnostico/diagnostico.entity';
import { PacienteEntity } from './paciente/paciente.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PacienteMedicoModule } from './paciente-medico/paciente-medico.module';
import { MedicoModule } from './medico/medico.module';
import { MedicoEntity } from './medico/medico.entity';

@Module({
  imports: [DiagnosticoModule, PacienteModule, MedicoModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'museum',
      entities: [DiagnosticoEntity, PacienteEntity, MedicoEntity
      ],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true
    }),
    PacienteMedicoModule,
    MedicoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
 })
 export class AppModule {}