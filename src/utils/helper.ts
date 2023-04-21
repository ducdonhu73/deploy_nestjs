import { Types } from 'mongoose';

export const mId = (id: string): Types.ObjectId => new Types.ObjectId(id);
