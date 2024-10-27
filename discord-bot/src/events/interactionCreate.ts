import { Interaction, Client } from 'discord.js';
import { StatusService } from '../services/statusService';
import { MemberService } from '../services/memberService';
import { logger } from '../utils/logger';

export default async (interaction: Interaction, client: Client, memberService: MemberService, statusService: StatusService) => {
  if (!interaction.isChatInputCommand()) return;

  try {
    if (interaction.user.bot) return; // Ignore bot interactions

    const guild = interaction.guild;
    if (!guild) return; // Ignore interactions not in a guild

    const member = guild.members.cache.get(interaction.user.id);
    if (!member) return; // Ignore interactions from members not found in the cache

    // Update member status in the database
    const updatedMember = await memberService.updateMember(member.id, {
      status: member.presence.status,
      activity: member.presence.activities?.[0]?.name || null,
      avatar: member.user.avatarURL({ dynamic: true, size: 1024 }) || null,
    });

    // Update member status in the status service
    await statusService.updateMemberStatus(guild.id, member.id, updatedMember.status);
  } catch (error) {
    logger.error(`Error handling interactionCreate event: ${error}`);
  }
};