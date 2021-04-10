import * as React from 'react';
import { Component } from 'react';
import { getUa } from '@/utils';

export const keyboard = (WrappedComponent: any) =>
  class HOC extends Component<any> {
    focusinHandler: any;

    focusoutHandler: any;

    resizeHandler: any;

    componentDidMount() {
      if (this.focusinHandler && this.focusoutHandler) {
        document.body.removeEventListener('focusin', this.focusinHandler);
        document.body.removeEventListener('focusout', this.focusoutHandler);
      }
      if (this.resizeHandler) {
        window.removeEventListener('resize', this.resizeHandler);
      }
      const { isIOS, isAndroid } = getUa();
      if (isIOS) {
        let isReset = true; // 是否归位
        this.focusinHandler = () => {
          isReset = false; // 聚焦时键盘弹出，焦点在输入框之间切换时，会先触发上一个输入框的失焦事件，再触发下一个输入框的聚焦事件
        };
        this.focusoutHandler = () => {
          isReset = true;
          setTimeout(() => {
            // 当焦点在弹出层的输入框之间切换时先不归位
            if (isReset) {
              const { activeElement } = document;
              if (
                activeElement &&
                (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')
              ) {
                // @ts-ignore
                activeElement.blur();
              }
              window.scroll(0, 0); // 确定延时后没有聚焦下一元素，是由收起键盘引起的失焦，则强制让页面归位
            }
          }, 30);
        };
        document.body.addEventListener('focusin', this.focusinHandler);
        document.body.addEventListener('focusout', this.focusoutHandler);
      }
      if (isAndroid) {
        const originHeight = document.documentElement.clientHeight || document.body.clientHeight;
        this.resizeHandler = () => {
          const resizeHeight = document.documentElement.clientHeight || document.body.clientHeight;
          const { activeElement } = document;
          if (resizeHeight < originHeight) {
            // 键盘弹起后逻辑
            if (
              activeElement &&
              (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')
            ) {
              setTimeout(() => {
                // 焦点元素滚到可视区域的问题
                if ('scrollIntoView' in document.activeElement) {
                  document.activeElement.scrollIntoView({ block: 'center' });
                } else {
                  // @ts-ignore
                  document.activeElement.scrollIntoViewIfNeeded(true);
                }
                activeElement.scrollIntoView({ block: 'center' });
              }, 0);
            }
          } else if (
            activeElement &&
            (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')
          ) {
            // @ts-ignore
            activeElement.blur();
          }
        };
        window.addEventListener('resize', this.resizeHandler);
      }
    }

    componentWillUnmount() {
      if (this.focusinHandler && this.focusoutHandler) {
        document.body.removeEventListener('focusin', this.focusinHandler);
        document.body.removeEventListener('focusout', this.focusoutHandler);
      }
      if (this.resizeHandler) {
        window.removeEventListener('resize', this.resizeHandler);
      }
    }

    render() {
      // eslint-disable-next-line react/jsx-props-no-spreading
      return <WrappedComponent {...this.props} />;
    }
  };

