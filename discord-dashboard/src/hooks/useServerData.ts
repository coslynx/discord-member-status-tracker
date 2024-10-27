import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { useToast } from "@chakra-ui/react";

export const useServerData = (serverId: string | undefined) => {
  const toast = useToast();
  const { data: session, status } = useSession();
  const router = useRouter();

  return useQuery(
    ["serverData", serverId],
    async () => {
      if (!serverId) {
        return null;
      }
      const response = await axios.get(`/api/server/${serverId}`, {
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
          description: "Failed to fetch server data",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        router.push("/");
      },
    }
  );
};