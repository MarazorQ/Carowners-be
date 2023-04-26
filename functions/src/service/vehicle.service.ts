import { Request } from 'express';

import { CreateVehicleDto } from '../dtos/vehicle.dto';
import Logger from '../core/logger/loger.service';
import { HttpException } from '../core/errors/httpException.service';
import { HttpStatus } from '../core/enums/httpStatus.enum';
import { db } from '../db/firebase';
import { HistoryService } from './history.service';

import { FieldValue } from '@google-cloud/firestore';

interface IVehicle {
  id: string;
  year: string;
  price: string;
  model: string;
  brand: string;
  mileage: string;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
}

export class VehicleService {
  async getAll(req: Request): Promise<IVehicle[]> {
    try {
      const { uid } = req.user;

      const snapshot = await db.collection('users').doc(uid).collection('vehicles').get();

      const vehicles = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as IVehicle[]; // Extract the vehicle data from the document snapshots

      return vehicles;
    } catch (error) {
      console.error('[GET_ALL_VEHICLE_ERROR]', error);
      Logger.error(error);

      throw new HttpException({
        httpCode: error?.httpCode || HttpStatus.INTERNAL_SERVER_ERROR,
        name: error?.name || 'Internal server error',
      });
    }
  }

  async delete(vehicleId: string, req: Request): Promise<any> {
    try {
      const { uid } = req.user;

      await db.collection('users').doc(uid).collection('vehicles').doc(vehicleId).delete();

      // Update the history collection
      await HistoryService.updateHistory(uid, vehicleId, 'delete');

      return { message: 'Success' };
    } catch (error) {
      console.error('[DELETE_VEHICLE_ERROR]', error);
      Logger.error(error);

      throw new HttpException({
        httpCode: error?.httpCode || HttpStatus.INTERNAL_SERVER_ERROR,
        name: error?.name || 'Internal server error',
      });
    }
  }

  async create(payload: CreateVehicleDto, req: Request): Promise<IVehicle> {
    try {
      const { uid } = req.user;

      const ref = await db
        .collection('users')
        .doc(uid)
        .collection('vehicles')
        .add({
          createdAt: FieldValue.serverTimestamp() || null,
          ...payload,
        }); // Add the new vehicle document to the user's vehicles collection

      const snapshot = await ref.get(); // Query the new vehicle document
      const vehicle = { id: snapshot.id, ...snapshot.data() } as IVehicle; // Extract the vehicle data from the document snapshot
      // Update the history collection
      await HistoryService.updateHistory(uid, snapshot.id, 'create');

      return vehicle;
    } catch (error) {
      console.error('[VEHICLE_CREATE_ERROR]', error);
      Logger.error(error);

      throw new HttpException({
        httpCode: error?.httpCode || HttpStatus.INTERNAL_SERVER_ERROR,
        name: error?.name || 'Internal server error',
      });
    }
  }

  async update(vehicleId: string, payload: CreateVehicleDto, req: Request): Promise<IVehicle> {
    try {
      const { uid } = req.user;

      const vehicleRef = db.collection('users').doc(uid).collection('vehicles').doc(vehicleId);

      await vehicleRef.update(JSON.parse(JSON.stringify(payload)));

      const vehicleDoc = await vehicleRef.get();
      const updatedVehicle = { id: vehicleDoc.id, ...vehicleDoc.data() } as IVehicle;

      // Update the history collection
      await HistoryService.updateHistory(uid, vehicleDoc.id, 'update');

      return updatedVehicle;
    } catch (error) {
      console.error('[VEHICLE_UPDATE_ERROR]', error);
      Logger.error(error);
    }
  }
}
