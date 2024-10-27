import { SlashCommandBuilder } from 'discord.js';
import { CommandInteraction } from 'discord.js';
import { logger } from '../utils/logger';
import { embedGenerator } from '../utils/embedGenerator';
import { StatusService } from '../services/statusService';

export const data = new SlashCommandBuilder()
  .setName('status')
  .setDescription('View the status of members on the server.')
  .addStringOption((option) =>
    option
      .setName('username')
      .setDescription('Username of the member to view status.')
      .setRequired(false),
  );

export async function execute(interaction: CommandInteraction) {
  const username = interaction.options.getString('username');

  try {
    const statusService = new StatusService();

    let members;
    if (username) {
      members = await statusService.getMemberStatusByUsername(
        interaction.guild!.id,
        username,
      );
    } else {
      members = await statusService.getAllMemberStatuses(interaction.guild!.id);
    }

    if (!members.length) {
      await interaction.reply({
        content: 'No members found with that username.',
        ephemeral: true,
      });
      return;
    }

    const embeds = embedGenerator.generateStatusEmbeds(members);

    await interaction.reply({ embeds });
  } catch (error) {
    logger.error(error);
    await interaction.reply({
      content: 'There was an error while executing this command!',
      ephemeral: true,
    });
  }
}