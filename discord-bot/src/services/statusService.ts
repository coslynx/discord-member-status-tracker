import { Guild, Member } from '../database/models';
import { logger } from '../utils/logger';
import { GuildService } from './guildService';
import { MemberService } from './memberService';
import { StatusFormatter } from '../utils/statusFormatter';
import { MemberStatus } from '../types/memberStatus';

export class StatusService {
  private guildService: GuildService;
  private memberService: MemberService;
  private statusFormatter: StatusFormatter;

  constructor() {
    this.guildService = new GuildService();
    this.memberService = new MemberService();
    this.statusFormatter = new StatusFormatter();
  }

  async updateMemberStatus(guildId: string, memberId: string, status: MemberStatus): Promise<void> {
    try {
      const member = await this.memberService.getMember(memberId);

      if (!member) {
        logger.warn(`Member not found for ID: ${memberId}`);
        return;
      }

      // Update member status in database
      await this.memberService.updateMember(memberId, { status });

      // Get guild config
      const guild = await this.guildService.getGuild(guildId);

      // If status channel is set, send status update
      if (guild && guild.statusChannelId) {
        const formattedStatus = this.statusFormatter.formatMemberStatus(member);
        const statusChannel = await this.guildService.getChannel(guild.statusChannelId);
        await statusChannel.send(formattedStatus);
      }
    } catch (error) {
      logger.error(`Error updating member status: ${error}`);
    }
  }

  async getMemberStatusByUsername(guildId: string, username: string): Promise<MemberStatus[]> {
    try {
      const members = await this.memberService.getMembersByUsername(guildId, username);

      if (!members.length) {
        return [];
      }

      return members.map((member) => this.statusFormatter.formatMemberStatus(member));
    } catch (error) {
      logger.error(`Error getting member status by username: ${error}`);
      return [];
    }
  }

  async getAllMemberStatuses(guildId: string): Promise<MemberStatus[]> {
    try {
      const members = await this.memberService.getAllMembers(guildId);
      return members.map((member) => this.statusFormatter.formatMemberStatus(member));
    } catch (error) {
      logger.error(`Error getting all member statuses: ${error}`);
      return [];
    }
  }
}