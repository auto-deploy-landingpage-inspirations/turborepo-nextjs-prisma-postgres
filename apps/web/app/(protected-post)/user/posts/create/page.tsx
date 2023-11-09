import { redirect } from "next/navigation"

import { getServerSession } from "@/utils/auth"
import PostForm from "./post-form"

export default async function Page() {
  const session = await getServerSession()

  if (!session) {
    redirect("/signIn")
  }

  return <PostForm />
}
