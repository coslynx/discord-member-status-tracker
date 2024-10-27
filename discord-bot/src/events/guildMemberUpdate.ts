import { GuildMember, Client } from 'discord.js';
import { StatusService } from '../services/statusService';
import { MemberService } from '../services/memberService';
import { logger } from '../utils/logger';

export default async (oldMember: GuildMember, newMember: GuildMember, client: Client, memberService: MemberService, statusService: StatusService) => {
  try {
    if (oldMember.user.bot) return; // Ignore bot member updates

    // Update member status in the database
    const updatedMember = await memberService.updateMember(newMember.id, {
      status: newMember.presence.status,
      activity: newMember.presence.activities?.[0]?.name || null,
      avatar: newMember.user.avatarURL({ dynamic: true, size: 1024 }) || null,
    });

    // Update member status in the status service
    await statusService.updateMemberStatus(newMember.guild.id, newMember.id, updatedMember.status);
  } catch (error) {
    logger.error(`Error handling guildMemberUpdate event: ${error}`);
  }
};