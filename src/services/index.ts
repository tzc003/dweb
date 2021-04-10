import request from '@/utils/request';
import { setHeader } from '@/utils';
// http://localhost:8080/?notifyUrl=test&payType=4&amount=500&outOrderNo=Test161f6349699128&token=eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMzYyOTc3MTM5NDg2MzcxODQyIiwiZXhwIjoxNjE2NDUzODEzLCJ1c2VySWQiOjEzNjI5NzcxMzk0ODYzNzE4NDIsImlhdCI6MTYxNjM2NzQxMywiYWNjb3VudCI6InNoMSIsInVzZXJLZXkiOiJ4eHh4In0.3CoHhnsfd5v85oSQHf_86ebaQFrVldtg9NwwQE-b0B1tOhs33hrQPeDNYGhl_9z05LBatN-y72gh8AvBPorOSg#/result/success
// const delay = (ms) =>
//   new Promise((resolve) => {
//     setTimeout(resolve, ms);
//   });

/**
 * 快捷下单
 * @param {*} params
 */
export async function quickOrder(params: any) {
  const headers = setHeader();
  return request({
    url: `/api/otcOrder/quickOrder`,
    method: 'post',
    data: params,
    headers,
  });
}

/**
 * 根据订单号查询订单信息
 * @param {*} params
 */
export async function orderInfo(params: any) {
  const headers = setHeader();
  return request({
    url: `/api/otcOrder/findByOrderNo`,
    method: 'post',
    data: params,
    headers,
  });
}


/**
 * 确认支付
 * @param {*} params
 */
export async function payOrder(params: any) {
  const headers = setHeader();
  return request({
    url: `/api/otcOrder/payOrder`,
    method: 'post',
    data: params,
    headers,
  });
}

/**
 * 清除token（页面关闭时调用，或者调用确认支付成功后调用）
 * @param {*} params
 */
export async function removeToken() {
  const headers = setHeader();
  return request({
    url: `/api/otcAppUser/remove`,
    method: 'post',
    headers,
  });
}
