import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { useToast } from "@chakra-ui/react";

export const useMemberStatus = (serverId: string | undefined) => {
  const toast = useToast();
  const { data: session, status } = useSession();
  const router = useRouter();

  return useQuery(
    ["memberStatus", serverId],
    async () => {
      if (!serverId) {
        return [];
      }
      const response = await axios.get(`/api/members/${serverId}`, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      return response.data;
    },
    {
      enabled: !!serverId && !!session && status !== "loading",
      onError: (error) => {
        toast({
          title: "Error",
          description: "Failed to fetch member status",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        router.push("/");
      },
    }
  );
};