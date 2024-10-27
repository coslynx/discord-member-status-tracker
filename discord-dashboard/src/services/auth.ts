import { Session, getServerSession } from "next-auth/next";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import { redirect } from "next/navigation";

export default async function getSession(req: NextApiRequest, res: NextApiResponse) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (session) {
    return session;
  } else {
    redirect("/login");
    return null;
  }
}