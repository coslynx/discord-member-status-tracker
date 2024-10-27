import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useServerData } from '../hooks/useServerData';
import { useMemberDetails } from '../hooks/useMemberDetails';
import { useMemberActivity } from '../hooks/useMemberActivity';

import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Grid,
  GridItem,
  Flex,
  useToast,
  CircularProgress,
  CircularProgressLabel,
} from '@chakra-ui/react';
import { formatDate } from '../utils/formatDate';

const MemberActivity = ({ serverId }: { serverId: string }) => {
  const { data: session, status } = useSession();
  const toast = useToast();
  const { serverData, isLoading: isServerDataLoading } = useServerData(serverId);
  const { memberDetails, isLoading: isMemberDetailsLoading } =
    useMemberDetails(serverId);
  const { memberActivity, isLoading: isMemberActivityLoading } =
    useMemberActivity(serverId);

  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  useEffect(() => {
    if (session && status !== 'loading') {
      setSelectedMemberId(session.user.id);
    }
  }, [session, status]);

  if (
    isServerDataLoading ||
    isMemberDetailsLoading ||
    isMemberActivityLoading
  ) {
    return (
      <Box
        bg="gray.100"
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

  if (!serverData || !memberDetails || !memberActivity) {
    return (
      <Box
        bg="gray.100"
        borderRadius="md"
        p={4}
        textAlign="center"
        minHeight="200px"
      >
        <Text>Server data not found</Text>
      </Box>
    );
  }

  return (
    <Box bg="gray.100" borderRadius="md" p={4}>
      <Heading size="md" mb={4}>
        Member Activity
      </Heading>
      {selectedMemberId && (
        <>
          <HStack mb={4}>
            <Text fontWeight="bold">Member:</Text>
            <Text>
              {memberDetails.username}#{memberDetails.discriminator}
            </Text>
          </HStack>
          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
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
              </VStack>
            </GridItem>
            <GridItem>
              <VStack align="start" spacing={4}>
                <Heading size="sm" mb={2}>
                  Recent Activities
                </Heading>
                {memberActivity.recentActivities.length > 0 ? (
                  <VStack align="start" spacing={2}>
                    {memberActivity.recentActivities.map(
                      (activity, index) => (
                        <HStack key={index}>
                          <Text>
                            {formatDate(activity.timestamp)} -{' '}
                            {activity.type}
                          </Text>
                          {activity.name && <Text>{activity.name}</Text>}
                        </HStack>
                      ),
                    )}
                  </VStack>
                ) : (
                  <Text>No recent activities found</Text>
                )}
              </VStack>
            </GridItem>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default MemberActivity;