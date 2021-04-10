import React, { Component } from 'react';
import Pay from '@/containers/Pay';
import { RouteConfig } from 'react-router-config';
import { PageProps } from '@/utils/types';
import { checkUrl, getParames } from '@/utils';

interface Props extends PageProps {
  route: RouteConfig;
}

class index extends Component<Props> {
  componentDidMount() {
    checkUrl();
    const accessToken = getParames('token') || 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMzYyOTc3MTM5NDg2MzcxODQyIiwiZXhwIjoxNjE1Mjc0MTgzLCJ1c2VySWQiOjEzNjI5NzcxMzk0ODYzNzE4NDIsImlhdCI6MTYxNTI3MjM4MywiYWNjb3VudCI6InNoMSIsInVzZXJLZXkiOiJ4eHh4In0.8ZN-DVltOe-DFyjzwWOLN4IY3F-85d2QmEJDwt-_Sq4OBq9NBRh1fLXfLv5oSlcVLpVMn2yK30V2eE6w32I2gw';
    sessionStorage.setItem('accessToken', accessToken);
  }

  render() {
    return (
      <Pay
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...this.props}
      />
    );
  }
}

export default index;