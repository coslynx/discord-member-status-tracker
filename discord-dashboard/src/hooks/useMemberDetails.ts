import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { useToast } from "@chakra-ui/react";

export const useMemberDetails = (serverId: string | undefined, memberId: string | undefined) => {
  const toast = useToast();
  const { data: session, status } = useSession();
  const router = useRouter();

  return useQuery(
    ["memberDetails", serverId, memberId],
    async () => {
      if (!serverId || !memberId) {
        return null;
      }
      const response = await axios.get(`/api/member/${serverId}/${memberId}`, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      return response.data;
    },
    {
      enabled: !!serverId && !!memberId && !!session && status !== "loading",
      onError: (error) => {
        toast({
          title: "Error",
          description: "Failed to fetch member details",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        router.push(`/server/${serverId}`);
      },
    }
  );
};