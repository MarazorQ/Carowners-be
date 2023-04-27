import { db } from '../db/firebase';
import Logger from '../core/logger/loger.service';
import { Timestamp } from 'firebase-admin/firestore';

import { HttpException } from '../core/errors/httpException.service';
import { HttpStatus, ErrorMessages } from '../core/enums/httpStatus.enum';

interface IHistoryTimeFormat {
  create: Timestamp;
  delete: Timestamp;
}
interface IHistory {
  id?: string;
  data: IHistoryTimeFormat;
}

interface IAllHistoryResponse {
  history: IHistory[];
}

export class HistoryService {
  // Helper function to update the history collection
  static async updateHistory(uid: string, vehicleId: string, action: string) {
    try {
      const historyRef = db.collection('users').doc(uid).collection('history').doc(vehicleId);

      const history = await historyRef.get();

      if (history.exists) {
        const data = history.data();
        data[action] = new Date();
        await historyRef.set(data);
      } else {
        const data = {
          create: new Date(),
          [action]: new Date(),
        };
        await historyRef.set(data);
      }
    } catch (error) {
      Logger.error(`[HISTORY_UPDATE_ERROR] ${error}`);
    }
  }

  async getAll(uid: string): Promise<IAllHistoryResponse> {
    try {
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
      Logger.error(`[GET_ALL_HISTORY_ERROR] ${error}`);

      throw new HttpException({
        httpCode: error?.httpCode || HttpStatus.INTERNAL_SERVER_ERROR,
        name: error?.name || ErrorMessages.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
