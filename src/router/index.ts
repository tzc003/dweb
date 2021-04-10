import { RouteConfig } from "react-router-config";
import Pay from '@/pages/Pay';
import Payu from '@/containers/Payu';
import Order from '@/pages/Order';
import Result from "@/pages/Result";
import Fail from "@/pages/Fail";
import Success from "@/pages/Success";
import OrderBankCard from "@/containers/OrderBankCard";

const routes: RouteConfig[] = [
  {
    path: '/',
    exact: true,
    component: Pay,
  },
  {
    path: '/order',
    component: Order,
  },
  {
    path: '/orderBankCard',
    component: OrderBankCard,
  },
  {
    path: '/payu',
    component: Payu,
  },
  {
    path: '/result',
    component: Result,
    children: [
      { path: "/result/fail", component: Fail },
      { path: "/result/success", component: Success },
      { path: "/user/timeout", component: Fail },
    ],
  },
];

export default routes;

