import { SlashCommandBuilder } from 'discord.js';
import { CommandInteraction } from 'discord.js';
import { logger } from '../utils/logger';
import { GuildService } from '../services/guildService';
import { MemberService } from '../services/memberService';
import { embedGenerator } from '../utils/embedGenerator';

export const data = new SlashCommandBuilder()
  .setName('setup')
  .setDescription('Setup the bot for this server.')
  .addChannelOption((option) =>
    option
      .setName('status-channel')
      .setDescription('The channel to display member status updates.')
      .setRequired(true),
  );

export async function execute(interaction: CommandInteraction) {
  const statusChannel = interaction.options.getChannel('status-channel');

  if (!statusChannel || !statusChannel.isTextBased()) {
    await interaction.reply({
      content: 'Please provide a valid text channel for status updates.',
      ephemeral: true,
    });
    return;
  }

  try {
    const guildService = new GuildService();
    const memberService = new MemberService();

    const guild = await guildService.getGuild(interaction.guild!.id);

    // Update guild config
    await guildService.updateGuildConfig(interaction.guild!.id, {
      statusChannelId: statusChannel.id,
    });

    // Initial sync of members
    const members = await interaction.guild!.members.fetch();

    for (const member of members.values()) {
      await memberService.createMember(member.user.id, {
        guildId: interaction.guild!.id,
        username: member.user.username,
        discriminator: member.user.discriminator,
        avatar: member.user.avatarURL(),
      });
    }

    const embed = embedGenerator.generateSuccessEmbed({
      title: 'Bot Setup Complete!',
      description: `Status updates will now be displayed in <#${statusChannel.id}>.`,
    });

    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    logger.error(error);
    await interaction.reply({
      content: 'There was an error while executing this command!',
      ephemeral: true,
    });
  }
}