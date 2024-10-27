import mongoose, { Document, Model, Schema } from 'mongoose';

export interface GuildDocument extends Document {
  _id: string;
  statusChannelId: string | null;
}

export interface GuildModel extends Model<GuildDocument> {}

const guildSchema = new Schema<GuildDocument>({
  _id: { type: String, required: true },
  statusChannelId: { type: String, default: null },
});

export const Guild: GuildModel = mongoose.model<GuildDocument, GuildModel>(
  'Guild',
  guildSchema,
);