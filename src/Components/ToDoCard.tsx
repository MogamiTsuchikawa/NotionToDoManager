import React, { useState } from "react";
import { ToDo } from "../interface";
import { updateToDo } from "../notion";
type Props = {
  todo: ToDo;
  onUpdate: () => void;
};
const ToDoCard = ({ todo, onUpdate }: Props) => {
  const [viewProgress, setViewProgress] = useState(false);
  const onClickStatusUpdateBtn = () => {
    setViewProgress(true);
    (async () => {
      if (todo.status === "未着手") todo.status = "対応中";
      else todo.status = "完了";
      await updateToDo(todo);
      setViewProgress(false);
      onUpdate();
    })();
  };
  return (
    <fieldset>
      <h1 style={{ fontSize: "15px", marginTop: 0 }}>
        {todo.title + " "}
        <a
          target="_blank"
          href={"https://www.notion.so/" + todo.pageId.replace(/-/g, "")}
        >
          開く
        </a>
      </h1>
      <button onClick={onClickStatusUpdateBtn}>
        {todo.status === "未着手" ? "対応中にする" : "完了にする"}
      </button>
      {viewProgress ? (
        <div role="progressbar" className="marquee"></div>
      ) : (
        <></>
      )}
    </fieldset>
  );
};

export default ToDoCard;
