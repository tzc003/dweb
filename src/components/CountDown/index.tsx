import React, { useState, useEffect, useRef } from 'react';
import { formatCountDown } from '@/utils';

import './index.scss';

interface Props {
  time: number;
  className?: string;
  style?: Object;
  onEnd?: Function;
}

const CountDown: React.FC<Props> = ({ time, className, style, onEnd }) => {
  const timeS = useRef(time);
  const [count, setCount] = useState(time);
  const timer = useRef(null);

  useEffect(() => {
    timeS.current = time;
    if (!timer.current) {
      timer.current = setInterval(() => {
        timeS.current -= 1;
        if (timer.current) {
          setCount(timeS.current);
        }
        if (timeS.current < 0) {
          onEnd && onEnd();
          clearInterval(timer.current);
          timer.current = null;
          timeS.current = null;
        }
      }, 1000);
    }
    return () => {
      if (timer.current) {
        clearInterval(timer.current);
        timer.current = null;
        timeS.current = null;
      }
    };
  }, [time]);

  const data = formatCountDown(count);

  return (
    <div className={`m-countdown ${className || ''}`} style={style}>
      <div className="num">{data.h || '00'}</div>
      <span className="dot">:</span>
      <div className="num">{data.m || '00'}</div>
      <span className="dot">:</span>
      <div className="num">{data.s || '00'}</div>
    </div>
  );
};

export default CountDown;
