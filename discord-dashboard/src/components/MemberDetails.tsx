import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Grid,
  GridItem,
  Avatar,
  useColorModeValue,
  Spinner,
  Flex,
  useToast,
} from '@chakra-ui/react';
import { useMemberDetails } from '../hooks/useMemberDetails';
import { useMemberActivity } from '../hooks/useMemberActivity';
import { formatDate } from '../utils/formatDate';

const MemberDetails = ({ serverId, memberId }: { serverId: string; memberId: string }) => {
  const toast = useToast();
  const { memberDetails, isLoading: isMemberDetailsLoading } = useMemberDetails(serverId, memberId);
  const { memberActivity, isLoading: isMemberActivityLoading } = useMemberActivity(serverId, memberId);

  if (isMemberDetailsLoading || isMemberActivityLoading) {
    return (
      <Box
        bg={useColorModeValue('gray.100', 'gray.700')}
        borderRadius="md"
        p={4}
        textAlign="center"
        minHeight="200px"
      >
        <Spinner size="lg" color="blue.500" />
        <Text>Loading member details...</Text>
      </Box>
    );
  }

  if (!memberDetails || !memberActivity) {
    return (
      <Box
        bg={useColorModeValue('gray.100', 'gray.700')}
        borderRadius="md"
        p={4}
        textAlign="center"
        minHeight="200px"
      >
        <Text>Member not found</Text>
      </Box>
    );
  }

  return (
    <Box bg={useColorModeValue('gray.100', 'gray.700')} borderRadius="md" p={4}>
      <Heading size="md" mb={4}>
        Member Details
      </Heading>
      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <GridItem>
          <VStack align="start" spacing={4}>
            <HStack>
              <Avatar
                size="lg"
                src={memberDetails.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'}
              />
              <VStack align="start" spacing={1}>
                <Text fontWeight="bold">
                  {memberDetails.username}#{memberDetails.discriminator}
                </Text>
                <Text>{memberDetails.status}</Text>
              </VStack>
            </HStack>
            <Text fontWeight="bold">Roles:</Text>
            <HStack spacing={2}>
              {memberDetails.roles.length > 0 ? (
                memberDetails.roles.map((roleId) => (
                  <Text key={roleId}>{roleId}</Text>
                ))
              ) : (
                <Text>No roles assigned</Text>
              )}
            </HStack>
          </VStack>
        </GridItem>
        <GridItem>
          <VStack align="start" spacing={4}>
            <Heading size="sm" mb={2}>
              Online Presence
            </Heading>
            <Text>
              Total Online Time:
              {memberActivity.totalOnlineTime
                ? `${Math.round(memberActivity.totalOnlineTime / 3600)} hours`
                : 'No data available'}
            </Text>
            <Text>
              Last Seen:
              {memberActivity.lastSeen
                ? formatDate(memberActivity.lastSeen)
                : 'Never seen online'}
            </Text>
            <Heading size="sm" mb={2}>
              Recent Activities
            </Heading>
            {memberActivity.recentActivities.length > 0 ? (
              <VStack align="start" spacing={2}>
                {memberActivity.recentActivities.map((activity, index) => (
                  <HStack key={index}>
                    <Text>
                      {formatDate(activity.timestamp)} -{' '}
                      {activity.type}
                    </Text>
                    {activity.name && <Text>{activity.name}</Text>}
                  </HStack>
                ))}
              </VStack>
            ) : (
              <Text>No recent activities found</Text>
            )}
          </VStack>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default MemberDetails;