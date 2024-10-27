import mongoose, { Document, Model, Schema } from 'mongoose';

export interface MemberDocument extends Document {
  guildId: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  status: 'online' | 'offline' | 'idle' | 'dnd';
  activity: string | null;
}

export interface MemberModel extends Model<MemberDocument> {}

const memberSchema = new Schema<MemberDocument>({
  guildId: { type: String, required: true },
  username: { type: String, required: true },
  discriminator: { type: String, required: true },
  avatar: { type: String, default: null },
  status: { type: String, enum: ['online', 'offline', 'idle', 'dnd'], default: 'offline' },
  activity: { type: String, default: null },
});

export const Member: MemberModel = mongoose.model<MemberDocument, MemberModel>('Member', memberSchema);