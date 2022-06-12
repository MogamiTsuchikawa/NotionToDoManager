import { Client } from "@notionhq/client";
import axios from "axios";
import { SettingJson, ToDo } from "./interface";
const getClientAndSetting = () => {
  const settingJson = localStorage.getItem("setting");
  const settings: SettingJson | undefined = settingJson
    ? JSON.parse(settingJson)
    : undefined;
  if (!settings) return { settings: undefined, notion: undefined };
  const notion = new Client({ auth: settings!.token });
  return { settings: settings, notion: notion };
};
export const getToDos = async () => {
  const { settings, notion } = getClientAndSetting();
  if (!settings) return undefined;
  try {
    const response = await notion.databases.query({
      database_id: settings.databaseId,
      filter: {
        or: [
          {
            property: "status",
            select: {
              equals: "未着手",
            },
          },
          {
            property: "status",
            select: {
              equals: "対応中",
            },
          },
        ],
      },
    });
    console.log(response);
    const todosTmp: ToDo[] = response.results.map((card) => {
      const data: any = card;
      return {
        title: data.properties.Name.title[0].plain_text,
        status: data.properties.status.select.name,
        pageId: data.id,
        view: true,
      };
    });
    return todosTmp;
  } catch (error: any) {
    console.error(error.body);
    return undefined;
  }
};

const getStatusId = (name: string) => {
  if (name.indexOf("未着手") !== -1) return "1";
  if (name.indexOf("対応中") !== -1) return "2";
  if (name.indexOf("完了") !== -1) return "3";
  return "1";
};

export const updateToDo = async (todo: ToDo) => {
  const { settings, notion } = getClientAndSetting();
  if (!settings) return undefined;
  axios.patch(
    `https://api.notion.com/v1/pages/${todo.pageId}`,
    {
      properties: {
        status: {
          select: {
            id: getStatusId(todo.status),
          },
        },
      },
    },
    {
      headers: {
        Authorization: `Bearer ${settings.token}`,
        "Notion-Version": "2022-02-22",
      },
    }
  );
};

export const createToDo = async (todo: ToDo) => {
  const { settings, notion } = getClientAndSetting();
  if (!settings) return undefined;
  console.log(todo);
  try {
    const response = await notion.pages.create({
      parent: {
        database_id: settings.databaseId,
      },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: todo.title,
              },
            },
          ],
        },
        status: {
          select: {
            id: getStatusId(todo.status),
          },
        },
      },
    });
  } catch (err) {
    console.log(err);
  }
};
