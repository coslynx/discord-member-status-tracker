import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Avatar,
  useColorModeValue,
  Spinner,
  List,
  ListItem,
  ListIcon,
  IconButton,
  Tooltip,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button,
  useToast,
  Select,
  Input,
} from '@chakra-ui/react';
import { FaUser, FaChevronDown } from 'react-icons/fa';
import { useState, useEffect, useRef } from 'react';
import { useMemberStatus } from '../hooks/useMemberStatus';
import { useMemberDetails } from '../hooks/useMemberDetails';
import { useServerData } from '../hooks/useServerData';
import { useMemberActivity } from '../hooks/useMemberActivity';
import { formatDate } from '../utils/formatDate';

interface MemberListItemProps {
  member: {
    id: string;
    username: string;
    discriminator: string;
    avatar: string | null;
    status: string;
    activity: string | null;
  };
  selectedMemberId: string | null;
  setSelectedMemberId: (memberId: string | null) => void;
}

const MemberListItem: React.FC<MemberListItemProps> = ({
  member,
  selectedMemberId,
  setSelectedMemberId,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [isMemberDetailsLoading, setIsMemberDetailsLoading] = useState(false);
  const [isMemberActivityLoading, setIsMemberActivityLoading] = useState(false);
  const [memberDetails, setMemberDetails] = useState<{
    id: string;
    username: string;
    discriminator: string;
    avatar: string | null;
    roles: string[];
  } | null>(null);
  const [memberActivity, setMemberActivity] = useState<{
    totalOnlineTime: number;
    lastSeen: Date | null;
    recentActivities: {
      timestamp: Date;
      type: string;
      name: string | null;
    }[];
  } | null>(null);
  const serverId = 'serverId';

  const handleMemberClick = () => {
    setSelectedMemberId(member.id);
    onOpen();
    setIsMemberDetailsLoading(true);
    setIsMemberActivityLoading(true);
    const getMemberDetails = async () => {
      try {
        const details = await useMemberDetails(serverId, member.id);
        setMemberDetails(details);
        setIsMemberDetailsLoading(false);
      } catch (error) {
        console.error('Error fetching member details:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch member details',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };
    const getMemberActivity = async () => {
      try {
        const activity = await useMemberActivity(serverId, member.id);
        setMemberActivity(activity);
        setIsMemberActivityLoading(false);
      } catch (error) {
        console.error('Error fetching member activity:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch member activity',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };
    getMemberDetails();
    getMemberActivity();
  };

  return (
    <>
      <ListItem
        key={member.id}
        onClick={handleMemberClick}
        bg={
          selectedMemberId === member.id
            ? useColorModeValue('gray.200', 'gray.700')
            : 'transparent'
        }
        _hover={{
          bg: useColorModeValue('gray.200', 'gray.700'),
        }}
        borderRadius="md"
        p={3}
      >
        <HStack spacing={4} alignItems="center">
          <Avatar
            size="sm"
            src={member.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'}
          />
          <VStack align="start" spacing={1}>
            <Text fontWeight="bold">
              {member.username}#{member.discriminator}
            </Text>
            <Text>{member.status}</Text>
          </VStack>
          <Tooltip label={member.activity || 'No Activity'}>
            <IconButton
              icon={<FaUser />}
              size="xs"
              variant="ghost"
              aria-label="Member Activity"
            />
          </Tooltip>
        </HStack>
      </ListItem>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {memberDetails?.username}#{memberDetails?.discriminator}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isMemberDetailsLoading || isMemberActivityLoading ? (
              <Flex alignItems="center" justifyContent="center" h="100%">
                <Spinner size="lg" color="blue.500" />
                <Text>Loading member details...</Text>
              </Flex>
            ) : (
              <>
                <VStack align="start" spacing={4} mb={4}>
                  <HStack>
                    <Avatar
                      size="lg"
                      src={
                        memberDetails?.avatar ||
                        'https://cdn.discordapp.com/embed/avatars/0.png'
                      }
                    />
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="bold">
                        {memberDetails?.username}
                        #{memberDetails?.discriminator}
                      </Text>
                      <Text>{memberDetails?.status}</Text>
                    </VStack>
                  </HStack>
                  <Text fontWeight="bold">Roles:</Text>
                  {memberDetails?.roles.length > 0 ? (
                    <List spacing={2}>
                      {memberDetails?.roles.map((role) => (
                        <ListItem key={role}>
                          <ListIcon as={FaChevronDown} color="blue.500" />
                          <Text>{role}</Text>
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Text>No roles assigned</Text>
                  )}
                </VStack>

                <VStack align="start" spacing={4}>
                  <Heading size="sm" mb={2}>
                    Online Presence
                  </Heading>
                  <Text>
                    Total Online Time:{' '}
                    {memberActivity?.totalOnlineTime
                      ? `${Math.round(memberActivity.totalOnlineTime / 3600)} hours`
                      : 'No data available'}
                  </Text>
                  <Text>
                    Last Seen:{' '}
                    {memberActivity?.lastSeen
                      ? formatDate(memberActivity?.lastSeen)
                      : 'Never seen online'}
                  </Text>
                  <Heading size="sm" mb={2}>
                    Recent Activities
                  </Heading>
                  {memberActivity?.recentActivities.length > 0 ? (
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
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

interface MemberListProps {
  members: {
    id: string;
    username: string;
    discriminator: string;
    avatar: string | null;
    status: string;
    activity: string | null;
  }[];
  selectedMemberId: string | null;
  setSelectedMemberId: (memberId: string | null) => void;
}

const MemberList: React.FC<MemberListProps> = ({
  members,
  selectedMemberId,
  setSelectedMemberId,
}) => {
  const serverId = 'serverId';
  const { serverData, isLoading: isServerDataLoading } = useServerData(serverId);
  const { memberStatuses, isLoading: isMemberStatusLoading } = useMemberStatus(
    serverId,
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMembers, setFilteredMembers] = useState(members);
  const [isAddingRole, setIsAddingRole] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [selectedRole, setSelectedRole] = useState<
    { id: string; name: string } | undefined
  >(undefined);
  const [isRoleManagementLoading, setIsRoleManagementLoading] =
    useState(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleSearch = () => {
      if (searchQuery.trim() === '') {
        setFilteredMembers(members);
        return;
      }
      const filtered = members.filter((member) => {
        return (
          member.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          member.discriminator.includes(searchQuery)
        );
      });
      setFilteredMembers(filtered);
    };

    handleSearch();
  }, [searchQuery, members]);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleAddRole = async () => {
    if (!newRoleName) {
      toast({
        title: 'Error',
        description: 'Please enter a role name',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsRoleManagementLoading(true);
      const response = await fetch('/api/roles/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serverId: serverId,
          memberId: selectedMemberId,
          roleName: newRoleName,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add role');
      }
      setNewRoleName('');
      setIsRoleManagementLoading(false);
      onClose();
      toast({
        title: 'Role Added',
        description: `Role ${newRoleName} successfully added.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error adding role:', error);
      toast({
        title: 'Error',
        description: 'Failed to add role.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsRoleManagementLoading(false);
    }
  };

  const handleRemoveRole = async () => {
    if (!selectedRole || !selectedMemberId) {
      return;
    }

    try {
      setIsRoleManagementLoading(true);
      const response = await fetch('/api/roles/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serverId: serverId,
          memberId: selectedMemberId,
          roleId: selectedRole.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove role');
      }
      setSelectedRole(undefined);
      setIsRoleManagementLoading(false);
      toast({
        title: 'Role Removed',
        description: `Role ${selectedRole.name} successfully removed.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error removing role:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove role.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsRoleManagementLoading(false);
    }
  };

  if (
    isServerDataLoading ||
    isMemberStatusLoading ||
    isRoleManagementLoading
  ) {
    return (
      <Box
        bg={useColorModeValue('gray.100', 'gray.700')}
        borderRadius="md"
        p={4}
        textAlign="center"
        minHeight="200px"
      >
        <Spinner size="lg" color="blue.500" />
        <Text>Loading member list...</Text>
      </Box>
    );
  }

  return (
    <>
      <Box
        bg={useColorModeValue('gray.100', 'gray.700')}
        borderRadius="md"
        p={4}
      >
        <Heading size="md" mb={4}>
          Member List
        </Heading>
        <HStack mb={4}>
          <Input
            placeholder="Search by username or discriminator"
            onChange={handleSearchInputChange}
            ref={inputRef}
          />
        </HStack>
        <List spacing={2}>
          {filteredMembers.map((member) => (
            <MemberListItem
              key={member.id}
              member={member}
              selectedMemberId={selectedMemberId}
              setSelectedMemberId={setSelectedMemberId}
            />
          ))}
        </List>
      </Box>

      {/ Modal for adding a role /}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Member Role Management</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack align="start" spacing={4} mb={4}>
              <Text fontWeight="bold">Current Roles:</Text>
              {serverData?.roles?.length > 0 ? (
                <List spacing={2}>
                  {serverData.roles
                    .filter((role) =>
                      selectedMemberId
                        ? serverData.members.find(
                            (member) => member.id === selectedMemberId,
                          )?.roles.includes(role.id),
                        : false,
                    )
                    .map((role) => (
                      <ListItem key={role.id}>
                        <ListIcon as={FaChevronDown} color="blue.500" />
                        <Text>{role.name}</Text>
                      </ListItem>
                    ))}
                </List>
              ) : (
                <Text>No roles assigned</Text>
              )}
            </VStack>
            <VStack align="start" spacing={4}>
              <HStack>
                <Text fontWeight="bold">Add Role:</Text>
                <Input
                  placeholder="Role Name"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                />
                <Button
                  onClick={handleAddRole}
                  colorScheme="blue"
                  isLoading={isAddingRole}
                >
                  Add Role
                </Button>
              </HStack>
              <HStack>
                <Text fontWeight="bold">Remove Role:</Text>
                <Select
                  placeholder="Select Role"
                  onChange={(e) =>
                    setSelectedRole(
                      serverData?.roles?.find(
                        (role) => role.id === e.target.value,
                      ),
                    )
                  }
                >
                  {serverData?.roles?.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </Select>
                <Button
                  onClick={handleRemoveRole}
                  colorScheme="red"
                  disabled={!selectedRole || !selectedMemberId}
                  isLoading={isRoleManagementLoading}
                >
                  Remove Role
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default MemberList;