import React, { Component, ChangeEvent } from 'react';
import { RouteConfig } from 'react-router-config';
import Toast from '@/components/Toast';
import Dialog from '@/components/Dialog';
import CountDown from '@/components/CountDown';
import { keyboard } from '@/utils/keyboard';
import { PageProps } from '@/utils/types';
import { copy, log } from '@/utils';
import { orderInfo, payOrder } from '@/services';

import lockPng from '@/images/lock.png';
import bankPng from '@/images/bank1.png';
import paidPng from '@/images/paid.png';
import delPng from '@/images/del.png';
import upiPng from '@/images/upi2.png';

import './index.scss';
import payway from "@/images/payway.png";

interface Props extends PageProps {
  route: RouteConfig;
}

interface State {
  orderNo?: string;
  outOrderNo?: string;
  orderState?: number;
  usePayInfo?: {
    account?: string;
    bankBranch?: string,
    bankName?: string,

  };
  tradeAmount?: number;
  countDown?: number;
  uty: {
    value: string;
    error: boolean;
  };
}

const spaceWrapReg = /(^\s*)|(\s*$)/g;

class OrderBankCard extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      uty: {
        value: '',
        error: false
      }
    }
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    const { history } = this.props;
    try {
      const res = await orderInfo({
        orderNo: sessionStorage.orderNo,
      });

      // {
      //   "code":200,
      //   "data":{
      //     "createTime":"2021-03-07 01:16:30",
      //     "currencyId":1,
      //     "currencyName":"",
      //     "expand":"",
      //     "id":63,
      //     "legalId":1,
      //     "orderNo":"6774014827510632448",
      //     "orderState":0,
      //     "orderType":0,
      //     "outOrderNo":"123455690",
      //     "payRemark":"{\"customerName\":\"\",\"customerMobile\":\"\",\"customerEmail\":\"\"}",
      //     "payTime":"",
      //     "payType":4,
      //     "serverTime":1615051128099,
      //     "timeOutTime":1615051890000,
      //     "tradeAmount":200.00000000,
      //     "tradeNum":2.55000000,
      //     "tradePrice":78.3000,
      //     "usePayInfo":{
      //       "account":"1762048218133",
      //       "bankBranch":"",
      //       "bankName":"",
      //       "image":"http:\/\/localhost:8080\/upload\/2021-02-24\/d3028158-746a-45d7-8652-16f164a966c0.jpeg",
      //       "name":"\u6797\u4E16\u5174",
      //       "payType":"4"
      //     }
      //   },
      //   "message":"\u8BF7\u6C42\u6210\u529F",
      //   "success":true
      // }

      // @ts-ignore
      if (res.success) {
        const { orderNo, outOrderNo, usePayInfo, tradeAmount, serverTime, timeOutTime } = res.data;
        if (timeOutTime - serverTime < 0) {
          history.push('/result/fail');
          return;
        }
        this.setState({
          orderNo,
          outOrderNo,
          usePayInfo,
          tradeAmount,
          // eslint-disable-next-line react/no-unused-state
          countDown: Math.floor((timeOutTime - serverTime) / 1000),
        });
      } else {
        // Toast('This payment method does not currently support placing an order, please place an order again!');
      }
    } catch (error) {
      // Toast('This payment method does not currently support placing an order, please place an order again!');
      // log(error);
    }
  }

  handleChangeUty = (e: ChangeEvent<HTMLInputElement>) => {
    let { value } = e.target;
    value = value.replace(spaceWrapReg, '');
    const reg =  /^[1-9]+[0-9]*]*$/;
    this.setState({
      uty: {
        value,
        error: value.length < 12 || !reg.test(value),
      }
    });
  }

  handleOk = () => {
    const { tradeAmount, uty } = this.state;
    if (!uty.value || (uty.value && uty.error)) return;
    Dialog({
      content: (
        <div className="confirm-dialog">
          <h3>Please confirm that you have paid</h3>
          <p>₹ <span>{tradeAmount || 200}</span></p>
        </div>
      ),
      okText: 'Confirm',
      cancelText: 'Return payment',
      onOk: (callback: Function) => {
        callback();
        this.handleSubmit();
      }
    });
  }

  handleSubmit = async () => {
    const { history } = this.props;
    const { uty, orderNo } = this.state;

    try {
      const res = await payOrder({
        orderNo: sessionStorage.orderNo || orderNo,
        refNo: uty.value,
      });

      // @ts-ignore
      if (res.success) {
        history.push('/result/success');
      } else {
        // Toast(`Failed to modify the status of the order, please contact the administrator for processing`);
      }
    } catch (error) {
      // Toast(`Failed to modify the status of the order, please contact the administrator for processing`);
      // log(error);
    }
  }

  timeEnd = () => {
    const { history } = this.props;
    history.push('/result/fail');
  }

  render() {
    const {
      outOrderNo,
      usePayInfo,
      tradeAmount,
      countDown,
      uty
    } = this.state;

    return (
      <div className="p-order">
        <div className="header">
          <div className="info">
            <div className="time">
              <img src={lockPng} alt="" />
              <span>Payment countdown</span>
              <div className="count-down">
                <CountDown time={countDown} onEnd={this.timeEnd} />
              </div>
            </div>
            <div className="num">
              <span>Order number：{outOrderNo}</span>
              <input value={outOrderNo} id="order-num" readOnly />
              <div className="btn" onClick={() => copy('order-num')}>Copy</div>
            </div>
          </div>
          <div className="order-amount">
            <p className="txt">Order amount</p>
            <div className="num">
              ₹ {tradeAmount}
            </div>
          </div>
        </div>

        <div className="payment-info step1">
          <div className="title">
            Step 1.Copy BankCard Information
          </div>
          <div className="flex">
            <div className="left">
              <span className="label">IFSC Code</span>
            </div>
            <div className="right">
              <span className="con">{usePayInfo?.bankName}</span>
              <input value={usePayInfo?.bankName} id="bank-name" readOnly style={{fontSize: 35}} />
              <div className="copy" onClick={() => copy('bank-name')}>Copy</div>
            </div>
          </div>
          <div className="flex">
            <div className="left">
              <span className="label">Receiving Name</span>
            </div>
            <div className="right">
              <span className="con">{usePayInfo?.bankBranch}</span>
              <input value={usePayInfo?.bankBranch} id="bank-branch" readOnly style={{fontSize: 35}} />
              <div className="copy" onClick={() => copy('bank-branch')}>Copy</div>
            </div>
          </div>
          <div className="flex">
            <div className="left">
              <span className="label">Receiving Account</span>
            </div>
            <div className="right">
              <span className="con">{usePayInfo?.account}</span>
              <input value={usePayInfo?.account} id="account" readOnly style={{fontSize: 35}} />
              <div className="copy" onClick={() => copy('account')}>Copy</div>
            </div>
          </div>
        </div>
        <div className="section step2">
          <div className="title">
            Step 2.Open online banking or wallet, transfer to the bank account above.
          </div>
        </div>
        <div className="section step3">
          <div className="title orange">
            Step.3 Enter Ref/UTR No.
          </div>
          <p className="txt">Enter the Ref/UTR No. at the bottom.</p>
          <p className="txt orange" style={{ margin: '.2rem 0', fontSize: '.65rem' }}>Please enter your Ref/UTR No. correctly</p>
          <input className={uty.error ? 'error' : ''} value={uty.value} type="text" style={{fontSize: 15}} placeholder="Enter Ref/UTR No." onChange={this.handleChangeUty} />
          {uty.error && <p className="error-txt">Please enter 12 numbers.</p>}
        </div>
        <div className="section step4">
          <div className="title">
            Example to get Ref/UTR No.
          </div>
          <div className="imgs">
            <div className="flex">
              <img src={bankPng} alt="" />
              <img src={paidPng} alt="" />
            </div>
            <div className="flex">
              <img src={delPng} alt="" />
              <img src={upiPng} alt="" />
            </div>
          </div>
        </div>
        <div className="section teaching">
          <div className="teaching-title">
            Payment tutorial
          </div>
          <div className="desc">
            <span className="recommend">Recommend</span>
            Choose payment method＞Copy transfer information on this page＞Open the corresponding payment software＞Paste transfer information＞Input password＞Payment successful.
          </div>
        </div>
        <div className="bottom-btn">
          <div className="btn" onClick={this.handleOk}>Enter Bank Transfer Ref/UTR No.</div>
        </div>
      </div>
    );
  }
}

export default keyboard(OrderBankCard);
