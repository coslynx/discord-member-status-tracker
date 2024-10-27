import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useServerData } from '../hooks/useServerData';
import { useMemberDetails } from '../hooks/useMemberDetails';
import { useRoleData } from '../hooks/useRoleData';
import { useRoleManagement } from '../hooks/useRoleManagement';

import MemberList from '../components/MemberList';
import MemberDetails from '../components/MemberDetails';

import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Box,
  Checkbox,
  Flex,
  Heading,
  HStack,
  IconButton,
  Input,
  Select,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';

const RoleManagement = ({ serverId }: { serverId: string }) => {
  const { data: session, status } = useSession();
  const toast = useToast();
  const { serverData, isLoading } = useServerData(serverId);
  const { memberDetails, isMemberDetailsLoading } = useMemberDetails(serverId);
  const { roleData, isRoleDataLoading } = useRoleData(serverId);
  const {
    selectedMember,
    setSelectedMember,
    selectedRole,
    setSelectedRole,
    isRoleManagementLoading,
    addRoleToMember,
    removeRoleFromMember,
  } = useRoleManagement(serverId);

  const { isOpen, onOpen, onClose } = useDisclosure();

  // State for the new role name
  const [newRoleName, setNewRoleName] = useState('');

  // Function to handle adding a new role
  const handleAddRole = async () => {
    if (!newRoleName) {
      toast({
        title: 'Error',
        description: 'Please enter a role name.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      await addRoleToMember(selectedMember?.id || '', newRoleName);
      setNewRoleName('');
      onClose();
      toast({
        title: 'Role Added',
        description: `Role ${newRoleName} successfully added to member`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to add role.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Function to handle removing a role
  const handleRemoveRole = async () => {
    try {
      await removeRoleFromMember(selectedMember?.id || '', selectedRole?.id || '');
      setSelectedRole(undefined);
      toast({
        title: 'Role Removed',
        description: `Role ${selectedRole?.name} successfully removed from member`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to remove role.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (isLoading || isRoleDataLoading || isRoleManagementLoading || isMemberDetailsLoading) {
    return (
      <Box
        bg="gray.100"
        borderRadius="md"
        p={4}
        textAlign="center"
        minHeight="200px"
      >
        <Text>Loading...</Text>
      </Box>
    );
  }

  if (!session || status === 'loading') {
    return (
      <Box
        bg="gray.100"
        borderRadius="md"
        p={4}
        textAlign="center"
        minHeight="200px"
      >
        <Text>Please login to access role management</Text>
      </Box>
    );
  }

  if (!serverData || !roleData || !memberDetails) {
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
    <>
      <Box bg="gray.100" borderRadius="md" p={4}>
        <Heading size="md" mb={4}>
          Role Management
        </Heading>
        <MemberList
          members={serverData.members}
          selectedMemberId={selectedMember?.id}
          setSelectedMemberId={setSelectedMember}
        />
        {selectedMember && (
          <>
            <VStack align="start" spacing={4} mt={4}>
              <HStack>
                <Text fontWeight="bold">Member:</Text>
                <Text>{selectedMember.username}#{selectedMember.discriminator}</Text>
              </HStack>
              <HStack>
                <Text fontWeight="bold">Current Roles:</Text>
                {selectedMember.roles.length > 0 ? (
                  <HStack spacing={2}>
                    {selectedMember.roles.map((roleId) => (
                      <Text key={roleId}>
                        {roleData.roles?.find((role) => role.id === roleId)?.name}
                      </Text>
                    ))}
                  </HStack>
                ) : (
                  <Text>No roles assigned</Text>
                )}
              </HStack>

              {/ Add Role Section /}
              <HStack>
                <Button onClick={onOpen} colorScheme="blue">
                  Add Role
                </Button>
                {/ Modal for Adding a New Role /}
                <Modal isOpen={isOpen} onClose={onClose} isCentered>
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Add Role to Member</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      <Input
                        placeholder="Role Name"
                        value={newRoleName}
                        onChange={(e) => setNewRoleName(e.target.value)}
                      />
                    </ModalBody>
                    <ModalFooter>
                      <Button onClick={onClose}>Cancel</Button>
                      <Button onClick={handleAddRole} colorScheme="blue">
                        Add Role
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              </HStack>

              {/ Remove Role Section /}
              <HStack>
                <Text fontWeight="bold">Remove Role:</Text>
                <Select
                  placeholder="Select Role"
                  onChange={(e) =>
                    setSelectedRole(
                      roleData.roles?.find(
                        (role) => role.id === e.target.value,
                      ),
                    )
                  }
                >
                  {roleData.roles?.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </Select>
                <Button onClick={handleRemoveRole} colorScheme="red" disabled={!selectedRole}>
                  Remove Role
                </Button>
              </HStack>
            </VStack>
          </>
        )}
      </Box>
    </>
  );
};

export default RoleManagement;