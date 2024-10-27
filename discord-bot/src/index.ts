import { Client, IntentsBitField, Collection } from 'discord.js';
import { ClientOptions } from 'discord.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { registerCommands } from './commands';
import { registerEvents } from './events';
import { MemberService } from './services/memberService';
import { StatusService } from './services/statusService';
import { logger } from './utils/logger';
import { Guild } from './database/models/guild';
import { Member } from './database/models/member';

dotenv.config();

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildPresences,
    IntentsBitField.Flags.GuildVoiceStates,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildMessageReactions,
    IntentsBitField.Flags.DirectMessages,
    IntentsBitField.Flags.DirectMessageReactions,
    IntentsBitField.Flags.GuildMessageTyping,
    IntentsBitField.Flags.DirectMessageTyping,
  ],
  partials: ['Channel', 'Message', 'GuildMember', 'User'],
  allowedMentions: { parse: ['users', 'roles'], repliedUser: false },
  presence: { activities: [{ name: 'Member Status', type: 'WATCHING' }] },
});

// Initialize services
const memberService = new MemberService();
const statusService = new StatusService();

client.commands = new Collection();

client.once('ready', async () => {
  await mongoose.connect(process.env.MONGODB_URI!);

  logger.info('Bot is online!');

  await registerCommands(client);
  await registerEvents(client, memberService, statusService);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: 'There was an error while executing this command!',
      ephemeral: true,
    });
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);