import { GuildMember, Client } from 'discord.js';
import { StatusService } from '../services/statusService';
import { MemberService } from '../services/memberService';
import { logger } from '../utils/logger';

export default async (member: GuildMember, client: Client, memberService: MemberService, statusService: StatusService) => {
  try {
    if (member.user.bot) return; // Ignore bot member removes

    // Remove member from the database
    await memberService.deleteMember(member.id);

    // Update member status in the status service
    await statusService.updateMemberStatus(member.guild.id, member.id, 'offline');
  } catch (error) {
    logger.error(`Error handling guildMemberRemove event: ${error}`);
  }
};