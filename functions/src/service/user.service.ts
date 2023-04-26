import { Request } from 'express';

import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import Logger from '../core/logger/loger.service';
import { HttpException } from '../core/errors/httpException.service';
import { HttpStatus } from '../core/enums/httpStatus.enum';
import { db } from '../db/firebase';

interface IUser {
  uid: any;
  phoneNumber: string;
  username: string;
  email?: string;
}

export class UserService {
  async getOne(req: Request): Promise<IUser> {
    try {
      const { uid } = req.user;

      const userRef = await db.collection('users').doc(uid).get();

      if (!userRef.exists) throw new HttpException({ httpCode: HttpStatus.BAD_REQUEST, name: 'User not found!' });
      const userDataObj = userRef.data() as IUser;

      return userDataObj;
    } catch (error) {
      console.error('[GET_ONE_USER_ERROR]', error);
      Logger.error(error);
    }
  }

  async create(payload: CreateUserDto, req: Request): Promise<IUser> {
    try {
      const { uid } = req.user;
      const { username, phoneNumber } = payload;

      const userQuerySnapshot = await db.collection('users').where('phoneNumber', '==', phoneNumber).get();

      // If the user already exists, return a response with an error message
      if (!userQuerySnapshot.empty)
        throw new HttpException({ httpCode: HttpStatus.BAD_REQUEST, name: 'User already exists!' });

      // If the user doesn't exist, create a new user in Firestore
      const newUser: IUser = { uid, username, phoneNumber };
      await db.collection('users').doc(uid).set(newUser);

      return newUser;
    } catch (error) {
      console.error('[USER_CREATE_ERROR]', error.httpCode);
      Logger.error(error);

      throw new HttpException({
        httpCode: error?.httpCode || HttpStatus.INTERNAL_SERVER_ERROR,
        name: error?.name || 'Internal server error',
      });
    }
  }

  async update(payload: UpdateUserDto, req: Request): Promise<IUser> {
    try {
      const { uid } = req.user;

      const userRef = db.collection('users').doc(uid);

      await userRef.update(JSON.parse(JSON.stringify(payload))); // update the user's data in the document

      const updatedUserData = (await userRef.get()).data() as IUser; // read the updated document and get the user data
      return updatedUserData;
    } catch (error) {
      console.error('[USER_UPDATE_ERROR]', error);
      Logger.error(error);

      throw new HttpException({
        httpCode: error?.httpCode || HttpStatus.INTERNAL_SERVER_ERROR,
        name: error?.name || 'Internal server error',
      });
    }
  }
}
