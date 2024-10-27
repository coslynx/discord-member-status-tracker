import { MessageEmbed } from 'discord.js';
import { MemberStatus } from '../types/memberStatus';

export class EmbedGenerator {
  generateStatusEmbeds(members: MemberStatus[]): MessageEmbed[] {
    const embeds: MessageEmbed[] = [];
    const membersPerPage = 10; // Number of members per embed

    for (let i = 0; i < members.length; i += membersPerPage) {
      const pageMembers = members.slice(i, i + membersPerPage);
      const embed = new MessageEmbed()
        .setColor('#0072ff')
        .setTitle('Member Statuses');

      pageMembers.forEach((member) => {
        embed.addField(
          `${member.username}#${member.discriminator}`,
          `Status: ${member.status}\nActivity: ${
            member.activity ? member.activity : 'None'
          }`,
          true, // Display fields inline
        );
      });

      embeds.push(embed);
    }

    return embeds;
  }

  generateSuccessEmbed(data: { title: string; description: string }): MessageEmbed {
    return new MessageEmbed()
      .setColor('#0072ff')
      .setTitle(data.title)
      .setDescription(data.description);
  }
}