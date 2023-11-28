import Link from "next/link"

import APP_ROUTES from "@/constants/routes"
import TagList from "@/molecules/tag/tag-list"
import PostMeta from "@/molecules/user/posts/post-meta"
import { TPostItem } from "@/types/posts"
import { generatePath } from "@/utils/generatePath"
import Comments from "./comments"
import PostContent from "./post-content"

export type PostDetailProps = {
  post: TPostItem
}

export default function PostDetail({ post }: PostDetailProps) {
  return (
    <div className="w-full">
      <div className="mb-8 w-full rounded bg-neutral-100 p-8">
        <h1 className="flex-1 text-4xl font-extrabold text-slate-700">
          <Link
            href={generatePath(APP_ROUTES.POST, {
              postId: post?.id,
            })}
          >
            {post?.title}
          </Link>
        </h1>

        <PostMeta post={post} />

        <TagList
          tags={post?.tagOnPost}
          classes={{
            container: "mt-4",
          }}
        />

        <PostContent post={post} />
      </div>
      <Comments />
    </div>
  )
}