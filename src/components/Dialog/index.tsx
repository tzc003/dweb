/**
 * 弹窗
 */
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { ModalHelper } from '@/utils';

import Confirm from './Confirm';

export interface Props {
  content?: string | React.ReactNode;
  title?: string | React.ReactNode;
  okText?: string;
  cancelText?: string;
  onOk?: any;
  onCancel?: any;
  maskOpacity?: number;
  noMask?: boolean;
  noCancel?: boolean;
}

export default function Dialog(config: Props, Centent = Confirm) {
  const div = document.createElement('div');
  div.id = 'dialog';
  document.body.appendChild(div);
  const currentConfig = {
    ...config,
    onOk: () => {
      config.onOk && config.onOk(() => destroy());
    },
    onCancel: () => {
      config.onCancel && config.onCancel();
      destroy();
    },
  };

  function destroy() {
    ModalHelper.beforeClose();
    const unmountResult = ReactDOM.unmountComponentAtNode(div);
    if (unmountResult && div.parentNode) {
      div.parentNode.removeChild(div);
    }
  }

  function render({ ...props }) {
    setTimeout(() => {
      ModalHelper.afterOpen();
      ReactDOM.render(
        <Centent
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...props}
        />,
        div
      );
    });
  }

  render(currentConfig);
}
