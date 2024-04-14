import { getTags } from "@/actions/tags"
import PageTitle from "@/molecules/page-title"
import { TTagListItem } from "@/types/tags"

import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"

export const metadata = {
  title: "Tags",
  description: "Tags are used to categorize tasks. You can create, edit, and delete tags here.",
}

export default async function Page({ searchParams }) {
  const { data, total } = await getTags({ ...searchParams })

  return (
    <div className="w-full p-8">
      <PageTitle title="Tags" />
      <DataTable<TTagListItem, string>
        columns={columns}
        tags={data}
        total={total}
      />
    </div>
  )
}
