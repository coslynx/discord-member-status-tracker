import { Client } from 'discord.js';
import mongoose from 'mongoose';
import { registerCommands } from './commands';
import { registerEvents } from './events';
import { MemberService } from '../services/memberService';
import { StatusService } from '../services/statusService';
import { logger } from '../utils/logger';

export default async (client: Client, memberService: MemberService, statusService: StatusService) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);

    logger.info('Bot is online!');

    await registerCommands(client);
    await registerEvents(client, memberService, statusService);
  } catch (error) {
    logger.error(`Error in ready event: ${error}`);
    process.exit(1);
  }
};