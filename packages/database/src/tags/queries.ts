import { Prisma } from "@prisma/client";
import { ColumnSort } from "@tanstack/react-table";

import { LIMIT_PER_PAGE } from "../constant";
import prisma from "../prisma";
import {
  tagItemSelect,
  tagListSelect,
  TTagItem,
  TTagListItem,
} from "./selects";

type GetTagsProps = {
  page?: number;
  limit?: number;
  query?: string;
  sorting?: ColumnSort[];
};

type GetTagsResponse = {
  data: TTagListItem[];
  total: number;
  limit: number;
  page: number;
  errorMessage?: string;
};

export const getTags = async ({
  page = 1,
  limit = LIMIT_PER_PAGE,
  query = "",
  sorting,
}: GetTagsProps): Promise<GetTagsResponse> => {
  const tagQuery: Prisma.TagsFindManyArgs = {
    select: tagListSelect,
    take: Number(limit) || 10,
    skip: (page > 0 ? page - 1 : 0) * Number(limit),
    where: {
      name: {
        contains: query,
        mode: "insensitive",
      },
    },
  };

  if (sorting) {
    tagQuery.orderBy = sorting?.map((sort) => ({
      [sort.id]: sort.desc ? "desc" : "asc",
    }));
  }

  try {
    const [data, total]: [TTagListItem[], number] = await Promise.all([
      prisma.tags.findMany(tagQuery),
      prisma.tags.count({
        where: tagQuery.where,
      }),
    ]);

    return {
      data,
      total,
      limit,
      page,
    };
  } catch (error) {
    throw {
      data: [],
      total: 0,
      limit,
      page,
      errorMessage: error.message,
    };
  }
};

type GetTagProps = {
  tagIdOrSlug: string;
};

type GetTagResponse = {
  data?: TTagItem;
  errorMessage?: string;
};

export const getTag = async ({
  tagIdOrSlug,
}: GetTagProps): Promise<GetTagResponse> => {
  try {
    const data: TTagItem = await prisma.tags.findFirst({
      where: {
        OR: [
          {
            id: tagIdOrSlug,
          },
          {
            slug: tagIdOrSlug,
          },
        ],
      },
      select: tagItemSelect,
    });

    return {
      data,
    };
  } catch (error) {
    return {
      data: undefined,
      errorMessage: error.message,
    };
  }
};

export const createTag = async (
  tag: Prisma.TagsCreateArgs["data"],
): Promise<TTagItem> => {
  return prisma.tags.create({
    data: tag,
    select: tagItemSelect,
  });
};

export const updateTag = async ({
  tagId,
  tag,
}: {
  tagId: string;
  tag: Prisma.TagsUpdateArgs["data"];
}): Promise<TTagItem> => {
  return prisma.tags.update({
    where: {
      id: tagId,
    },
    data: tag,
    select: tagItemSelect,
  });
};

export const deleteTag = async (tagId: string): Promise<TTagItem> => {
  return prisma.tags.delete({
    where: {
      id: tagId,
    },
    select: tagItemSelect,
  });
};
