import { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
  Icon,
  Tooltip,
  useToast,
  CircularProgress,
  CircularProgressLabel,
} from '@chakra-ui/react';
import {
  FaUsers,
  FaUserFriends,
  FaCalendarAlt,
  FaClock,
  FaHashtag,
} from 'react-icons/fa';
import { useServerData } from '../hooks/useServerData';
import { useMemberStatus } from '../hooks/useMemberStatus';

const ServerStats = ({ serverId }: { serverId: string }) => {
  const { serverData, isLoading } = useServerData(serverId);
  const { memberStatuses, isMemberStatusLoading } = useMemberStatus(serverId);
  const toast = useToast();

  if (isLoading || isMemberStatusLoading) {
    return (
      <Box
        bg={useColorModeValue('gray.100', 'gray.700')}
        borderRadius="md"
        p={4}
        textAlign="center"
        minHeight="200px"
      >
        <CircularProgress isIndeterminate color="blue.500" size="lg" />
        <CircularProgressLabel>Loading...</CircularProgressLabel>
      </Box>
    );
  }

  if (!serverData) {
    return (
      <Box
        bg={useColorModeValue('gray.100', 'gray.700')}
        borderRadius="md"
        p={4}
        textAlign="center"
        minHeight="200px"
      >
        <Text>Server data not found</Text>
      </Box>
    );
  }

  const onlineMembers = memberStatuses.filter(
    (member) => member.status === 'online',
  ).length;
  const totalMembers = serverData.memberCount;

  return (
    <Box
      bg={useColorModeValue('gray.100', 'gray.700')}
      borderRadius="md"
      p={4}
    >
      <Heading size="md" mb={4}>
        Server Statistics
      </Heading>
      <VStack align="start" spacing={4}>
        <Stat>
          <StatLabel>
            <Flex alignItems="center">
              <Icon as={FaUsers} color="blue.500" mr={2} />
              <Text>Total Members</Text>
            </Flex>
          </StatLabel>
          <StatNumber>{totalMembers}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>
            <Flex alignItems="center">
              <Icon as={FaUserFriends} color="green.500" mr={2} />
              <Text>Online Members</Text>
            </Flex>
          </StatLabel>
          <StatNumber>{onlineMembers}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>
            <Flex alignItems="center">
              <Icon as={FaCalendarAlt} color="orange.500" mr={2} />
              <Text>Created On</Text>
            </Flex>
          </StatLabel>
          <StatNumber>{serverData.createdAt}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>
            <Flex alignItems="center">
              <Icon as={FaClock} color="red.500" mr={2} />
              <Text>Last Seen Active</Text>
            </Flex>
          </StatLabel>
          <StatNumber>
            {serverData.lastSeenActive ? serverData.lastSeenActive : 'N/A'}
          </StatNumber>
        </Stat>
        <Stat>
          <StatLabel>
            <Flex alignItems="center">
              <Icon as={FaHashtag} color="purple.500" mr={2} />
              <Text>Active Channels</Text>
            </Flex>
          </StatLabel>
          <StatNumber>{serverData.activeChannels}</StatNumber>
        </Stat>
      </VStack>
    </Box>
  );
};

export default ServerStats;