import * as React from 'react';
import { useState, useEffect }  from 'react';
import { Props } from '.';

import './index.scss';

const Confirm: React.FC<Props> = (props) => {
  const {
    content,
    title,
    okText,
    cancelText,
    onOk,
    onCancel,
    maskOpacity = 0.7,
    noMask = false,
    noCancel = false,
  } = props;
  const [position, onChangePosition] = useState({});

  useEffect(() => {
    changePosition();

    window.addEventListener('resize', changePosition);

    return () => {
      window.removeEventListener('resize', changePosition);
    };
  }, []);

  const changePosition = () => {
    const contentDom = document.getElementById('j-dialog-wrap');
    const { width, height } = contentDom.getBoundingClientRect();
    const clientH = document.documentElement.clientHeight;
    const clientW = document.documentElement.clientWidth;
    const top = Math.floor((clientH - height) / 2);
    const left = Math.floor((clientW - width) / 2);
    onChangePosition({
      top: top % 2 === 0 ? top : top + 1,
      left: left % 2 === 0 ? left : left + 1,
      transform: 'translate(0, 0)',
    });
  };

  return (
    <div className="u-dialog">
      {!noMask ? (
        <div
          className="u-dialog-mask"
          style={{ background: `rgba(0, 0, 0, ${maskOpacity})` }}
          onClick={onCancel}
        />
      ) : (
        <div className="u-dialog-mask" style={{ background: `rgba(0, 0, 0, ${maskOpacity})` }} />
      )}
      <div className="u-dialog-wrap" id="j-dialog-wrap" style={position}>
        <div className="u-dialog-body">
          {title && <div className="u-dialog-title">{title}</div>}
          <div className={`u-dialog-content ${title ? 'has-title' : ''}`}>{content}</div>
          <div className="u-dialog-btns">
            {!noCancel && (
              <div className="u-dialog-btn u-dialog-btn__cancel" onClick={onCancel}>
                {cancelText || '取消'}
              </div>
            )}
            <div className="u-dialog-btn u-dialog-btn__ok" onClick={onOk}>
              {okText || '确定'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirm;
