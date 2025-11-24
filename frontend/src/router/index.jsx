import Layout from "../layouts";
import Home from "../pages/home";
import Ranking from "../pages/ranking";
import Schedule from "../pages/schedule";
import ScheduleDetail from "../pages/schedule/schedule.detail";

export const Router = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      { path: 'ranking', element: <Ranking /> },
      { path: 'schedule', element: <Schedule /> },
      { path: 'schedule/:id', element: <ScheduleDetail /> }
    ]
  }
];
export default Router;
