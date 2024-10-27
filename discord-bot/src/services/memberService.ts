import { Member, MemberDocument } from '../database/models/member';
import { logger } from '../utils/logger';

export class MemberService {
  async createMember(memberId: string, memberData: { guildId: string; username: string; discriminator: string; avatar: string | null }): Promise<MemberDocument> {
    try {
      const newMember = new Member({
        _id: memberId,
        guildId: memberData.guildId,
        username: memberData.username,
        discriminator: memberData.discriminator,
        avatar: memberData.avatar,
        status: 'offline',
      });

      return await newMember.save();
    } catch (error) {
      logger.error(`Error creating member: ${error}`);
      throw error;
    }
  }

  async getMember(memberId: string): Promise<MemberDocument | null> {
    try {
      return await Member.findById(memberId);
    } catch (error) {
      logger.error(`Error getting member: ${error}`);
      throw error;
    }
  }

  async getMembersByUsername(guildId: string, username: string): Promise<MemberDocument[]> {
    try {
      return await Member.find({ guildId, username: new RegExp(`^${username}$`, 'i') });
    } catch (error) {
      logger.error(`Error getting members by username: ${error}`);
      throw error;
    }
  }

  async getAllMembers(guildId: string): Promise<MemberDocument[]> {
    try {
      return await Member.find({ guildId });
    } catch (error) {
      logger.error(`Error getting all members: ${error}`);
      throw error;
    }
  }

  async updateMember(memberId: string, memberData: Partial<MemberDocument>): Promise<MemberDocument | null> {
    try {
      return await Member.findByIdAndUpdate(memberId, memberData, { new: true });
    } catch (error) {
      logger.error(`Error updating member: ${error}`);
      throw error;
    }
  }
}