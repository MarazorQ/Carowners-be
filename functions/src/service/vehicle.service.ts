import { CreateVehicleDto } from '../dtos/vehicle.dto';
import Logger from '../core/logger/loger.service';
import { HttpException } from '../core/errors/httpException.service';
import { HttpStatus, ErrorMessages } from '../core/enums/httpStatus.enum';
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
  async getAll(uid: string): Promise<IVehicle[]> {
    try {
      const snapshot = await db.collection('users').doc(uid).collection('vehicles').get();

      const vehicles = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as IVehicle[]; // Extract the vehicle data from the document snapshots

      return vehicles;
    } catch (error) {
      Logger.error(`[GET_ALL_VEHICLE_ERROR] ${error}`);

      throw new HttpException({
        httpCode: error?.httpCode || HttpStatus.INTERNAL_SERVER_ERROR,
        name: error?.name || ErrorMessages.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async delete(vehicleId: string, uid: string): Promise<{ message: string }> {
    try {
      await db.collection('users').doc(uid).collection('vehicles').doc(vehicleId).delete();

      // Update the history collection
      await HistoryService.updateHistory(uid, vehicleId, 'delete');

      return { message: 'Success' };
    } catch (error) {
      Logger.error(`[DELETE_VEHICLE_ERROR] ${error}`);

      throw new HttpException({
        httpCode: error?.httpCode || HttpStatus.INTERNAL_SERVER_ERROR,
        name: error?.name || ErrorMessages.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async create(payload: CreateVehicleDto, uid: string): Promise<IVehicle> {
    try {
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
      Logger.error(`[VEHICLE_CREATE_ERROR] ${error}`);

      throw new HttpException({
        httpCode: error?.httpCode || HttpStatus.INTERNAL_SERVER_ERROR,
        name: error?.name || ErrorMessages.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async update(vehicleId: string, payload: Partial<CreateVehicleDto>, uid: string): Promise<IVehicle> {
    try {
      const vehicleRef = db.collection('users').doc(uid).collection('vehicles').doc(vehicleId);

      await vehicleRef.update({ ...payload });

      const vehicleDoc = await vehicleRef.get();
      const updatedVehicle = { id: vehicleDoc.id, ...vehicleDoc.data() } as IVehicle;

      // Update the history collection
      await HistoryService.updateHistory(uid, vehicleDoc.id, 'update');

      return updatedVehicle;
    } catch (error) {
      Logger.error(`[VEHICLE_UPDATE_ERROR] ${error}`);

      throw new HttpException({
        httpCode: error?.httpCode || HttpStatus.INTERNAL_SERVER_ERROR,
        name: error?.name || ErrorMessages.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
