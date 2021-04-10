import copyFun from 'copy-to-clipboard';
import Toast from '@/components/Toast';

export function log(...message: any): void {
  if (window.console && (getParamByName('log') || process.env.NODE_ENV === 'development')) {
    // eslint-disable-next-line no-console
    console.log(...message);
  }
}

/**
 * get search value
 * @param {string} name - search key
 * @param {string} url - url
 * @returns {string}
 */
export function getParamByName(name: string, url: string = window.location.search): string {
  // eslint-disable-next-line no-useless-escape
  const key = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  const regex = new RegExp(`[\\?&]${key}=([^&#]*)`);
  let curl = url;
  if (typeof history.pushState !== 'function') {
    curl = window.location.hash; // ie9
  }
  const results = regex.exec(curl);
  return results == null ? '' : decodeURIComponent(results[1]);
}

export const getParames = (name: any): string | null => {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
  const r = window.location.search.substr(1).match(reg);
  if (r !== null) {
    return decodeURIComponent(r[2]);
  } else {
    return null;
  }
};

/**
 * 检测请求的数据
 * @param {*} response
 */
export const checkResponse = (response: any, sucesss: Function, notlogin: Function) => {
  const { code, result, message } = response;
  switch (code) {
    case 100:
      if (sucesss) sucesss(result);
      return result;
    case 99:
      if (notlogin) notlogin();
      return result;
    default:
      Toast(message);
      return {};
  }
};

/**
 * 节流函数
 * @param {*} func
 * @param {*} wait
 */
export const throttle = (func: Function, wait: number) => {
  let ctx: any;
  let args: any[];
  let rtn: any;
  let timeoutID: any;
  let last = 0;

  return function throttled(...args2: any[]) {
    ctx = this;
    args = args2;
    const delta = Number(new Date()) - last;
    if (!timeoutID)
      if (delta - last >= wait) call();
      else timeoutID = setTimeout(call, wait - delta);
    return rtn;
  };

  function call() {
    timeoutID = 0;
    last = +new Date();
    rtn = func.apply(ctx, args);
    ctx = null;
    args = null;
  }
};

/**
 * 解决滑动穿透问题
 */
export const ModalHelper = {
  afterOpen() {
    this.scrollTop = document.scrollingElement
      ? document.scrollingElement.scrollTop
      : document.body.scrollTop;
    document.documentElement.classList.add('fix_open');
    document.documentElement.style.top = `-${this.scrollTop}px`;
  },
  beforeClose() {
    document.documentElement.classList.remove('fix_open');
    document.documentElement.style.top = '0px';
    if (document.scrollingElement) {
      document.scrollingElement.scrollTop = this.scrollTop;
    } else {
      document.documentElement.scrollTop = this.scrollTop;
    }
    window.scroll(0, this.scrollTop);
  },
};

/**
 * 手机ua
 */
export function getUa() {
  const ua = window.navigator.userAgent.toLocaleLowerCase();
  const isIOS = /iphone|ipad|ipod/.test(ua);
  const isAndroid = /android/.test(ua);

  return {
    isIOS,
    isAndroid,
  };
}

export function checkUrl() {
  const accessToken = getParames('token');
  const payType = Number(getParames('payType'));
  const tradeAmount = Number(getParames('amount'));
  const outOrderNo = getParames('outOrderNo');
  const notifyUrl = getParames('notifyUrl');

  if (!tradeAmount) {
    Toast('amount cannot be empty');
  } else if (!outOrderNo) {
    Toast('outOrderNo cannot be empty');
  } else if (!accessToken) {
    Toast('token cannot be empty');
  } else if (!payType) {
    Toast('payType cannot be empty');
  } else if (!notifyUrl) {
    Toast('notifyUrl cannot be empty');
  }
}

export function copy(id: string) {
  if (!id) return;
  const $txt = document.getElementById(id);
  // @ts-ignore
  if ($txt.value && copyFun($txt.value)) {
    Toast('success');
  }
}

/**
 * @name Token请求头
 * @description 接口请求headers
 */
export function setHeader() {
  const accessToken = sessionStorage.getItem('accessToken');
  return {
    Authorization: `${accessToken}`,
  };
}


/**
 * 倒计时计算
 * @param time
 * @param callback
 */
export const formatCountDown = (time: number, callback?: Function) => {
  if (!time || time < 0) {
    callback && callback();
    return {
      m: '00',
      s: '00',
    };
  }
  let h: number | string = 0;
  let m: number | string = parseInt(`${time / 60}`, 10);
  let s: number | string = 0;
  if (m >= 60) {
    if (parseInt(`${m / 60}`, 10) >= 24) {
      h = parseInt(`${m / 60}`, 10) - parseInt(`${m / 60 / 24}`, 10) * 24;
      m %= 60;
    } else {
      h = parseInt(`${m / 60}`, 10);
      m %= 60;
      s = Math.floor(time % 60);
    }
  } else {
    m = m > 0 ? m % 60 : 0;
    s = Math.floor(time % 60);
  }
  h = h < 10 ? `0${h}` : h;
  m = m < 10 ? `0${m}` : m;
  s = s < 10 ? `0${s}` : s;

  return {
    h,
    m,
    s,
  };
};
