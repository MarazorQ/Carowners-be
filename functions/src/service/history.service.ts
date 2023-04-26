import { Request } from 'express';

import { db } from '../db/firebase';
import Logger from '../core/logger/loger.service';
import { Timestamp } from 'firebase-admin/firestore';

import { HttpException } from '../core/errors/httpException.service';
import { HttpStatus } from '../core/enums/httpStatus.enum';

interface IHistoryTimeFormat {
  create: Timestamp;
  delete: Timestamp;
}
interface IHistory {
  id?: string;
  data: IHistoryTimeFormat;
}

export class HistoryService {
  // Helper function to update the history collection
  static async updateHistory(uid: string, vehicleId: string, action: string) {
    try {
      const historyRef = db.collection('users').doc(uid).collection('history').doc(vehicleId);

      historyRef.get().then((doc: any) => {
        if (doc.exists) {
          const data = doc.data();
          data[action] = new Date();
          historyRef.set(data);
        } else {
          const data = {
            create: new Date(),
            [action]: new Date(),
          };
          historyRef.set(data);
        }
      });
    } catch (error) {
      console.error('[HISTORY_UPDATE_ERROR]', error);
      Logger.error(error);
    }
  }

  async getAll(req: Request): Promise<{ history: IHistory[] }> {
    try {
      const { uid } = req.user;

      const historyRef = db.collection('users').doc(uid).collection('history');
      const snapshot = await historyRef.get();
      const history: IHistory[] = [];

      snapshot.forEach((doc) => {
        history.push({
          id: doc.id,
          data: doc.data() as IHistoryTimeFormat,
        });
      });

      return { history };
    } catch (error) {
      console.error('[GET_ALL_HISTORY_ERROR]', error);
      Logger.error(error);

      throw new HttpException({
        httpCode: error?.httpCode || HttpStatus.INTERNAL_SERVER_ERROR,
        name: error?.name || 'Internal server error',
      });
    }
  }
}
