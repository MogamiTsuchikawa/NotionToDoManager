import { Client } from "@notionhq/client";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import ToDoCard from "./Components/ToDoCard";
import ToDoCardView from "./Components/ToDoCardView";
import { SettingJson, ToDo } from "./interface";
import { getToDos, updateToDo } from "./notion";

const Popup = () => {
  const [todos, setTodos] = useState<ToDo[]>([]);
  const getCards = async () => {
    const todoTmp = await getToDos();
    if (!todoTmp) return;
    setTodos(todoTmp);
  };
  useEffect(() => {
    getCards();
  }, []);
  const updateTodo = () => {
    getCards();
  };
  return (
    <div style={{ width: "400px" }} className="window">
      <div className="title-bar">
        <div className="title-bar-text">NOTIONﾀｽｸ管理ﾋﾞｭｰ</div>
        <div className="title-bar-controls">
          <button aria-label="Minimize"></button>
          <button aria-label="Maximize"></button>
          <button aria-label="Close"></button>
        </div>
      </div>
      <div className="window-body">
        <ToDoCardView todos={todos} onUpdateToDo={updateTodo} />
      </div>
    </div>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById("root")
);
