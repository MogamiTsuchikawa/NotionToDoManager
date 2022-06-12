export type ToDo = {
  title: string;
  status: string;
  limit?: Date;
  pageId: string;
  view: boolean;
};

export type SettingJson = {
  databaseId: string;
  token: string;
};
