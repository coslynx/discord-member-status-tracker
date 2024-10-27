import { VoiceState, Client } from 'discord.js';
import { StatusService } from '../services/statusService';
import { MemberService } from '../services/memberService';
import { logger } from '../utils/logger';

export default async (oldState: VoiceState, newState: VoiceState, client: Client, memberService: MemberService, statusService: StatusService) => {
  try {
    if (oldState.member?.user.bot) return; // Ignore bot voice state updates

    const guild = oldState.guild;
    if (!guild) return; // Ignore voice state updates not in a guild

    const member = guild.members.cache.get(newState.member!.id);
    if (!member) return; // Ignore voice state updates for members not found in the cache

    // Update member status in the database
    const updatedMember = await memberService.updateMember(member.id, {
      status: member.presence.status,
      activity: member.presence.activities?.[0]?.name || null,
      avatar: member.user.avatarURL({ dynamic: true, size: 1024 }) || null,
    });

    // Update member status in the status service
    await statusService.updateMemberStatus(guild.id, member.id, updatedMember.status);
  } catch (error) {
    logger.error(`Error handling voiceStateUpdate event: ${error}`);
  }
};