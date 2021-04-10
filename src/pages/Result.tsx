import React, { Component } from 'react';
import { renderRoutes, RouteConfig } from 'react-router-config';
import { PageProps } from '@/utils/types';

interface Props extends PageProps {
  route: RouteConfig;
}

class Result extends Component<Props, {}> {
  render() {
    const { route } = this.props
    return (
      <div style={{ height: '100%' }}>
        {renderRoutes(route.children)}
      </div>
    );
  }
}

export default Result;