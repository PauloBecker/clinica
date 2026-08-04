import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { Request, Response } from 'express';

import { CreatePatientDto } from './dto/create-patient.dto';
import * as patientService from '../service/patient.service';
import { PatientService } from '../service/patient.service';

export class PatientsController {
  constructor(private readonly patientService: PatientService) {}

  async createPatient(req: Request, res: Response) {
    const body: unknown = req.body;
    const createPatientDto = plainToClass(CreatePatientDto, body);

    await validateOrReject(createPatientDto);
    const patient = await this.patientService.create(createPatientDto);
    res.status(201).json({
      message: 'Patient created successfully',
      data: patient,
    });
  }

  async list(req: Request, res: Response) {
    const { nome } = req.query;

    if (nome && typeof nome !== 'string') {
      return res.status(400).json({
        message: 'query param "nome" must be a string',
      });
    }
    const patients = await this.patientService.list({ name: nome });
    res.json(patients);
  }

  async getPatient(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: 'Id is required',
      });
    }

    if (Number.isNaN(Number(id))) {
      return res.status(400).json({
        message: 'Id must be a number',
      });
    }

    const patient = await this.patientService.getPatient(Number(id));

    if (!patient) {
      return res.status(404).json({
        message: 'Patient not found',
      });
    }

    res.json(patient);
  }

  async updatePatient(req: Request, res: Response) {
    const body: unknown = req.body;
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Id is required' });
    }

    if (Number.isNaN(Number(id))) {
      return res.status(400).json({ message: 'Id must be a number' });
    }

    if (!body || typeof body !== 'object') {
      return res.status(400).json({ message: 'Body must be an object' });
    }

    if ('nome' in body && typeof body.nome !== 'string') {
      return res
        .status(400)
        .json({ message: 'property "nome" must be a string' });
    }

    try {
      const patient = await this.patientService.updatePatient(
        Number(id),
        body as any,
      );

      res.status(200).json({
        message: 'Patient updated successfully',
        data: patient,
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Patient not found') {
        return res.status(404).json({ message: 'Patient not found' });
      }
      throw error;
    }
  }
}
