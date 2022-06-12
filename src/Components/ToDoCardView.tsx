import React, { useState } from "react";
import { ToDo } from "../interface";
import { createToDo } from "../notion";
import ToDoCard from "./ToDoCard";
type Props = {
  todos: ToDo[];
  onUpdateToDo: () => void;
};
const ToDoCardView = ({ todos, onUpdateToDo }: Props) => {
  const tabList = ["対応中", "未着手", "新規ﾀｽｸ"];
  const [tabIndex, setTabIndex] = useState(0);
  const [titleText, setTitleText] = useState("");
  const onChangeTitleText: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setTitleText(e.target.value);
  };
  const onClickAddToDo = () => {
    (async () => {
      await createToDo({
        title: titleText,
        status: "未着手",
        view: true,
        pageId: "",
      });
      onUpdateToDo();
    })();
    setTitleText("");
  };
  if (todos.length === 0)
    return <div role="progressbar" className="marquee"></div>;

  return (
    <>
      <menu role="tablist">
        {tabList.map((tab, i) => (
          <button
            role="tab"
            aria-controls={tab}
            aria-selected={i === tabIndex}
            onClick={() => {
              setTabIndex(i);
            }}
          >
            {tab}
          </button>
        ))}
      </menu>
      {tabList.map((tab, i) => {
        if (tab === "新規ﾀｽｸ") {
          return (
            <article
              role="tabpanel"
              hidden={tabIndex !== i}
              id={tab}
              style={{ height: 300, overflowY: "scroll" }}
            >
              <div className="field-row">
                <label htmlFor="text21">ﾀｽｸ名</label>
                <input
                  id="text21"
                  value={titleText}
                  type="text"
                  onChange={onChangeTitleText}
                />
              </div>
              <button style={{ marginTop: "5px" }} onClick={onClickAddToDo}>
                ﾀｽｸを追加する
              </button>
            </article>
          );
        }
        return (
          <article
            role="tabpanel"
            hidden={tabIndex !== i}
            id={tab}
            style={{ height: 300, overflowY: "scroll" }}
          >
            {todos
              .filter((todo) => todo.status === tab)
              .map((todo) => (
                <ToDoCard todo={todo} onUpdate={onUpdateToDo} />
              ))}
          </article>
        );
      })}
    </>
  );
};

export default ToDoCardView;
