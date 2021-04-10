import React, { Component } from 'react';
import { RouteConfig } from 'react-router-config';
import { keyboard } from '@/utils/keyboard';
import { PageProps } from '@/utils/types';

interface Props extends PageProps {
  route: RouteConfig;
}

class Payu extends Component<Props> {

  data="<div id='mydiv'></div><script type='application/javascript'>console.log(window.sessionStorage.getItem('redirectHtml'));document.getElementById('mydiv').innerHTML=window.sessionStorage.getItem('redirectHtml');document.getElementById('payuform').submit()</script>";

  componentDidMount() {
    document.write(this.data)
  }

  render() {
    return (
      <div />
    );
  }
}

export default keyboard(Payu);
