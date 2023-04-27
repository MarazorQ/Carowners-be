import { CreateUserDto, UpdateUserDto, CheckUserPhoneDto } from '../dtos/user.dto';
import Logger from '../core/logger/loger.service';
import { HttpException } from '../core/errors/httpException.service';
import { HttpStatus, ErrorMessages } from '../core/enums/httpStatus.enum';
import { db, admin } from '../db/firebase';

interface IUser {
  uid: any;
  phoneNumber: string;
  username: string;
  email?: string;
}
export interface ICheckPhoneResponse {
  message: string;
}

export class UserService {
  async getOne(uid: string): Promise<IUser> {
    try {
      const userRef = await db.collection('users').doc(uid).get();

      if (!userRef.exists) throw new HttpException({ httpCode: HttpStatus.BAD_REQUEST, name: 'User not found!' });
      const userDataObj = userRef.data() as IUser;

      return userDataObj;
    } catch (error) {
      Logger.error(`[GET_ONE_USER_ERROR] ${error}`);

      throw new HttpException({
        httpCode: error?.httpCode || HttpStatus.INTERNAL_SERVER_ERROR,
        name: error?.name || ErrorMessages.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async create(payload: CreateUserDto, uid: string): Promise<IUser> {
    try {
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
      Logger.error(`[USER_CREATE_ERROR] ${error}`);

      throw new HttpException({
        httpCode: error?.httpCode || HttpStatus.INTERNAL_SERVER_ERROR,
        name: error?.name || ErrorMessages.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async update(payload: UpdateUserDto, uid: string): Promise<IUser> {
    try {
      const userRef = db.collection('users').doc(uid);
      const isUserExist = (await userRef.get()).exists;

      if (!isUserExist) throw new HttpException({ httpCode: HttpStatus.BAD_REQUEST, name: 'User not found!' });

      const { username, email } = payload;

      const newUserData = { username, email };

      Object.keys(newUserData).map((key) => {
        if (!newUserData[key]) delete newUserData[key];
      });

      await userRef.update({ ...newUserData }); // update the user's data in the document

      return (await userRef.get()).data() as IUser; // read the updated document and get the user data
    } catch (error) {
      Logger.error(`[USER_UPDATE_ERROR] ${error}`);

      throw new HttpException({
        httpCode: error?.httpCode || HttpStatus.INTERNAL_SERVER_ERROR,
        name: error?.name || ErrorMessages.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async checkUserPhone(payload: CheckUserPhoneDto): Promise<ICheckPhoneResponse> {
    try {
      const { phoneNumber } = payload;

      const userQuerySnapshot = await admin
        .firestore()
        .collection('users')
        .where('phoneNumber', '==', phoneNumber)
        .get();

      if (!userQuerySnapshot.empty) return { message: 'User exists' };
      else return { message: 'User not found!' };
    } catch (error) {
      Logger.error(`[USER_PHONE_CHECK_ERROR] ${error}`);

      throw new HttpException({
        httpCode: error?.httpCode || HttpStatus.INTERNAL_SERVER_ERROR,
        name: error?.name || ErrorMessages.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
