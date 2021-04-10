import React, { Component } from 'react';
import { RouteConfig } from 'react-router-config';
import { PageProps } from '@/utils/types';
import { keyboard } from '@/utils/keyboard';
import Header from '@/components/Header';
import { getParames } from '@/utils';
import { quickOrder } from '@/services';

import './index.scss';
import { Button, Radio,Tabs } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import paytm from '@/images/paytm.png';
import upi from '@/images/upi.png';
import bankcard from '@/images/bankcard.png';
import Toast from '@/components/Toast';


const { TabPane } = Tabs;
interface Props extends PageProps {
  route: RouteConfig;
}
// https://pmny.in/kISJcmJGx1WF
interface State {
  // show: boolean;
  payType?: number;
  tradeAmount?: number;
  outOrderNo?: string;
  expand?: string;
  paymethod?: string;
  // name: {
  //   value: string;
  //   error: string | boolean;
  // },
  // phone: {
  //   value: string;
  //   error: string;
  // },
  // email: {
  //   value: string;
  //   error: string;
  // }
}

// const emailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
// const spaceWrapReg = /(^\s*)|(\s*$)/g;

class Pay extends Component<Props, State> {

  constructor(props: Props) {
    super(props);

    // const payType = Number(getParames('payType'));
    const payType = -1;

    const tradeAmount = Number(getParames('amount'));
    const outOrderNo = getParames('outOrderNo');
    const expand = getParames('notifyUrl');
    // const customerName = getParames('customerName');
    // const customerMobile = getParames('customerMobile');
    // const customerEmail = getParames('customerEmail');

    this.state = {
      payType,
      tradeAmount,
      outOrderNo,
      expand,
      // show: true,
      // name: {
      //   value: customerName || '',
      //   error: '',
      // },
      // phone: {
      //   value: customerMobile || '',
      //   error: '',
      // },
      // email: {
      //   value: customerEmail || '',
      //   error: '',
      // },
    }
  }

  // handleToggle = () => {
  //   this.setState(({ show }) => ({
  //     show: !show,
  //   }));
  // }

  handleLabelClick = (e) => {
    this.setState({payType: e.currentTarget.getAttribute("data-value")})
  }

  handleTabClick = (e) => {
    this.setState({payType: -1})

    if (e == "2") {
      this.setState({payType: 5})
      this.setState({paymethod: "NB"})
    } else if (e == '0') {
      this.setState({paymethod: "CASHCARD"})
    } else if (e == '3') {
      this.setState({payType: 5})
      this.setState({paymethod: "CC,DC"})
    } else if (e == '1') {
      this.setState({paymethod: "CC,DC"})
    }
  }

  handleToOrder = async () => {
    const { history } = this.props;
    // const { name, phone, email, payType, outOrderNo, tradeAmount, expand } = this.state;
    const { paymethod, payType, outOrderNo, tradeAmount, expand } = this.state;
    if (payType == -1) {
      Toast('Please select one method')
      return
    }
    // if (!name.value) {
    //   this.setState({
    //     name: {
    //       ...name,
    //       error: true,
    //     }
    //   })
    // }
    // if (!phone.value) {
    //   this.setState({
    //     phone: {
    //       ...phone,
    //       error: 'The phone is required and cannot be empty',
    //     }
    //   })
    // }
    // if (!email.value) {
    //   this.setState({
    //     email: {
    //       ...email,
    //       error: 'The email is required and cannot be empty',
    //     }
    //   })
    // }

    // if (!name.value || !phone.value || !email.value) return;

    try {
      const res = await quickOrder({
        paymethod: paymethod || "CASHCARD",
        legalId: 1,
        currencyId: 1,
        tradeType: 0,
        payType: payType || 5,
        outOrderNo: outOrderNo || '123455690128',
        tradeAmount: tradeAmount || 200,
        expand,
        payRemark: JSON.stringify({
          // customerName: name.value,
          // customerMobile: phone.value,
          // customerEmail: email.value
        }),
      });

      // @ts-ignore
      if (res.success) {
        sessionStorage.setItem('orderNo', res.data.orderNo);
        sessionStorage.setItem('redirectHtml', res.data.redirectHtml);

        // sessionStorage.setItem('tradeAmount', res.data.tradeAmount);
        // sessionStorage.setItem('tradeNum', res.data.tradeNum);
        // sessionStorage.setItem('tradePrice', res.data.tradePrice);
        // upi
        if (payType == 4) {
          history.push('/order');
        } else if (payType == 1) {
          // bankcard
          history.push('/orderBankCard');
        } else if (payType == 5) {
          history.push("/payu")
        }
        // @ts-ignore
      } else {
        // @ts-ignore
        // Toast('Too many people are currently charging, please try again later');
      }
    } catch (error) {
      // Toast('Too many people are currently charging, please try again later');
      // log(error);
    }
  }

  /**
   * 监听输入框值的改变
   */
  // handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
  //   let { value } = e.target;
  //   if (field === 'phone') {
  //     value = value.replace(/\D/g, '');
  //   }
  //   if (field === 'name' || field === 'phone' || field === 'email') {
  //     value = value.replace(spaceWrapReg, '');
  //   }

  //   switch (field) {
  //     case 'name':
  //       this.setState({
  //         name: {
  //           value,
  //           error: value.length <= 0
  //         }
  //       });
  //       break;
  //     case 'phone':
  //       this.setState({
  //         phone: {
  //           value,
  //           error: !value ? 'The phone is required and cannot be empty' : (value.length !== 10 ? 'The input is not a valid phone number' : ''),
  //         }
  //       });
  //       break;
  //     case 'email':
  //       this.setState({
  //         email: {
  //           value,
  //           error: !value ? 'The email is required and cannot be empty' : (!emailReg.test(value) ? 'The input is not a valid email address' : ''),
  //         }
  //       });
  //       break;
  //     default:
  //       break;
  //   }
  // };

  render() {
    const { history } = this.props;
    // const { show, name, phone, email, tradeAmount } = this.state;
    const { tradeAmount } = this.state;
    return (
      <div className="p-pay has-header">
        <Header
          title="Dentonpay Checkout"
          left={
            <svg onClick={() => history.goBack()} style={{ marginLeft: 12 }} width="24" height="24" viewBox="0 0 512 512"><title>ionicons-v5-a</title>
              <polyline points="328 112 184 256 328 400" style={{ fill: 'none', stroke: 'white', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '48px' }} />
            </svg>
          }
        />
        <div className="order-amount">
          <p className="txt">Order amount</p>
          <div className="num">
            ₹ {tradeAmount}
          </div>
        </div>
        {/* <div className="pay-infomation">
          <div className="flex" onClick={this.handleToggle}>
            <div className="left">
              <img src={payinfomationPng} alt="" />
              <span>Pay infomation</span>
            </div>
            <div className="right">
              <svg className={show ? 'rotate' : ''} id="svgup" width="20" height="20" viewBox="0 0 512 512" style={{ transitionDuration: '0.2s' }}>
                <polyline points="112 328 256 184 400 328" style={{ fill: 'none', stroke: '#000', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '48px' }} />
              </svg>
            </div>
          </div>
          <div className={`form ${show ? 'show' : ''}`}>
            <div className="form-block">
              <label>Name</label>
              <input className={name.error ? 'error-line' : ''} value={name.value} type="text" onChange={(e) => this.handleChange(e, 'name')} />
              {name.error && <p className="error">The name is required and cannot be empty</p>}
            </div>
            <div className="form-block">
              <label>Phone</label>
              <input className={phone.error ? 'error-line' : ''} value={phone.value} pattern="\d*" type="tel" onChange={(e) => this.handleChange(e, 'phone')} />
              {phone.error && <p className="error">{phone.error}</p>}
            </div>
            <div className="form-block">
              <label>Email</label>
              <input className={email.error ? 'error-line' : ''} value={email.value} type="text" onChange={(e) => this.handleChange(e, 'email')} />
              {email.error && <p className="error">{email.error}</p>}
            </div>
          </div>
        </div> */}
        <div className="tabs">
          <Tabs defaultActiveKey="0" centered onChange={(e) => this.handleTabClick(e)}>

            <TabPane tab="Wallets" key="0">
              <div className="paywaywrap">
                <div className="line payway">
                  <label htmlFor="paytmpayway" className={this.state.payType == 6?'paywaylabel-clicked':'paywaylabel'}>
                    <div className="right" onClick={(e) => this.handleLabelClick(e)} data-value='6'>
                      <img src={paytm} alt="" />
                    </div>
                  </label>
                  <div className="left">
                    <input type="radio" defaultChecked name='payway' value='4' id='paytmpayway' />
                  </div>

                  <label htmlFor="otherwallets" className={this.state.payType == 5?'paywaylabel-clicked':'paywaylabel'}>
                    <div className="right" onClick={(e) => this.handleLabelClick(e)} data-value='5'>
                      <span>Other Wallets</span>
                    </div>
                  </label>
                  <div className="left">
                    <input type="radio" defaultChecked name='payway' value='5' id='otherwallets' />
                  </div>
                </div>
                <div className="desc" style={{textAlign: "center", display: this.state.payType == 5 ? "inherit" : "none"}}>
                  <p style={{fontSize:"16px"}}>The following Banks Are Supported:</p>
                  <select style={{height:"30px"}}>
                    <option value="SBIB">PhonePe</option>
                    <option value="HDFB">freecharge</option>
                    <option value="ICIB">OlaMoney</option>
                    <option value="AXIB">Airtel Money</option>
                    <option value="162B">Jio Money</option>
                    <option value="INOB">HDFC Bank - PayZapp</option>
                    <option value="IDBB">YES PAY Wallet</option>
                  </select>
                </div>
              </div>
            </TabPane>
            <TabPane tab="UPI&Transfer" key="1">
              <div className="paywaywrap">
                <div className="line payway">
                  <label htmlFor="upipayway" className={this.state.payType == 4?'paywaylabel-clicked':'paywaylabel'}>
                    <div className="right" onClick={(e) => this.handleLabelClick(e)} data-value='4'>
                      <img src={upi} alt="" />
                    </div>
                  </label>
                  <div className="left">
                    <input type="radio" defaultChecked name='payway' value='4' id='upipayway' />
                  </div>

                  <label htmlFor="bankcardpayway" className={this.state.payType == 1?'paywaylabel-clicked':'paywaylabel'}>
                    <div className="right" onClick={(e) => this.handleLabelClick(e)} data-value='1'>
                      <img src={bankcard} alt="" />
                    </div>
                  </label>
                  <div className="left">
                    <input type="radio" defaultChecked name='payway' value='1' id='bankcardpayway' />
                  </div>
                </div>
              </div>
            </TabPane>
            <TabPane tab="Cards" key="3">
              <div className="desc" style={{textAlign: "center"}}>
                <p style={{fontSize:"16px"}}>Credit & Debit Cards Are Supported</p>
              </div>
              <br />
            </TabPane>
            <TabPane tab="Banks" key="2">
              <div className="desc" style={{textAlign: "center"}}>
                <p style={{fontSize:"16px"}}>The following Banks Are Supported:</p>
                <select style={{height:"30px"}}>
                  <option value="SBIB">State Bank of India</option>
                  <option value="HDFB">HDFC Bank</option>
                  <option value="ICIB">ICICI Bank</option>
                  <option value="AXIB">AXIS Bank</option>
                  <option value="162B">Kotak Mahindra Bank</option>
                  <option value="INOB">Indian Overseas Bank</option>
                  <option value="IDBB">IDBI Bank</option>
                  <option value="AIRNB">Airtel Payments Bank</option>
                  <option value="BOIB">Bank of India</option>
                  <option value="BOMB">Bank of Maharashtra</option>
                  <option value="CABB">Canara Bank</option>
                  <option value="CSBN">Catholic Syrian Bank</option>
                  <option value="CBIB">Central Bank Of India</option>
                  <option value="CUBB">City Union Bank</option>
                  <option value="CSMSNB">Cosmos Bank</option>
                  <option value="DCBB">DCB Bank</option>
                  <option value="DENN">Dena Bank</option>
                  <option value="DSHB">Deutsche Bank</option>
                  <option value="DLSB">Dhanlaxmi Bank - Retail</option>
                  <option value="FEDB">Federal Bank</option>
                  <option value="IDFCNB">IDFC FIRST Bank</option>
                  <option value="INDB">Indian Bank</option>
                  <option value="INIB">IndusInd Bank</option>
                  <option value="JAKB">Jammu &amp; Kashmir Bank</option>
                  <option value="JSBNB">Janata Sahakari Bank Pune</option>
                  <option value="KRKB">Karnataka Bank</option>
                  <option value="KRVBC">Karur Vysya - Corporate Banking</option>
                  <option value="KRVB">Karur Vysya Bank</option>
                  <option value="LVRB">Lakshmi Vilas Bank</option>
                  <option value="OBCB">PNB (Erstwhile -Oriental Bank of Commerce)</option>
                  <option value="UNIB">PNB (Erstwhile-United Bank of India)</option>
                  <option value="PSBNB">Punjab &amp; Sind Bank</option>
                  <option value="PNBB">Punjab National Bank</option>
                  <option value="CPNB">Punjab National Bank - Corporate Banking</option>
                  <option value="SRSWT">Saraswat Bank</option>
                  <option value="SVCNB">Shamrao Vithal Co-operative Bank Ltd.</option>
                  <option value="SOIB">South Indian Bank</option>
                  <option value="SYNDB">Syndicate Bank</option>
                  <option value="TMBB">Tamilnad Mercantile Bank</option>
                  <option value="TBON">The Nainital Bank</option>
                  <option value="UCOB">UCO Bank</option>
                  <option value="UBIBC">Union Bank OLT - Corporate Banking</option>
                  <option value="UBIB">Union Bank of India</option>
                  <option value="ADBB">Union Bank of India (Erstwhile Andhra Bank)</option>
                  <option value="CRPB">Union Bank of India (Erstwhile Corporation Bank)</option>
                  <option value="YESB">Yes Bank</option>
                </select>
              </div>
              <br />
            </TabPane>



          </Tabs>
        </div>
        <div style={{textAlign: "center"}}>
          <Button type="primary" icon={<CheckCircleOutlined />} size="large" onClick={this.handleToOrder}>
            Pay Now
          </Button>
        </div>

      </div>
    );
  }

}

export default keyboard(Pay);
