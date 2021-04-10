import React, { Component } from 'react';
import { removeToken } from '@/services';
import { log } from '@/utils';

import successPng from '@/images/success.png';

import './index.scss';

interface Props {
  txt?: string;
}

class Success extends Component<Props, {}> {

  componentDidMount() {
    this.handleRemoveToken();
  }

  handleRemoveToken = async () => {
    try {
      await removeToken();
    } catch (error) {
      // log(error);
    }
  }

  render() {
    const { txt } = this.props
    return (
      <div className="p-success">
        <img src={successPng} alt="" />
        <span className="txt">{txt || 'It has been paid and is expected to arrive within five minutes'}</span>
      </div>
    );
  }
}

export default Success;
