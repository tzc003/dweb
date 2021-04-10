import React, { Component } from 'react';
import { RouteConfig } from 'react-router-config';
import { PageProps } from '@/utils/types';
import Order from '@/containers/Order';

interface Props extends PageProps {
  route: RouteConfig;
}

class index extends Component<Props> {
  render() {
    return (
      <Order
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...this.props}
      />
    );
  }
}

export default index;