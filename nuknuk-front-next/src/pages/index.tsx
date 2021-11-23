import React, { ReactElement }  from 'react'
import Head from 'next/head'
import { GetStaticProps } from 'next';
import StartUp from './start_up';

const Index = (): ReactElement => {
  return <StartUp />;
};
export default Index;