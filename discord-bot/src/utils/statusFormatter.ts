import { MemberDocument } from '../database/models/member';
import { MessageEmbed } from 'discord.js';
import { logger } from './logger';

export class StatusFormatter {
  formatMemberStatus(member: MemberDocument): MessageEmbed {
    try {
      const embed = new MessageEmbed()
        .setColor('#0072ff')
        .setAuthor({
          name: `${member.username}#${member.discriminator}`,
          iconURL: member.avatar
            ? member.avatar
            : 'https://cdn.discordapp.com/embed/avatars/0.png',
        })
        .setDescription(
          `Status: ${member.status}\nActivity: ${
            member.activity ? member.activity : 'None'
          }`,
        );

      return embed;
    } catch (error) {
      logger.error(`Error formatting member status: ${error}`);
      throw error;
    }
  }
}