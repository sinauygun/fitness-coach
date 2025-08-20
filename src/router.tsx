import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import CalendarView from "./views/CalendarView";
import ChartsView from "./views/ChartsView";
import EditorView from "./views/EditorView";

export const router = createBrowserRouter(
  [
    { path: "/", element: <App/> },
    { path: "/calendar", element: <CalendarView/> },
    { path: "/charts", element: <ChartsView/> },
    { path: "/editor", element: <EditorView/> }
  ],
  { basename: import.meta.env.BASE_URL }
);
