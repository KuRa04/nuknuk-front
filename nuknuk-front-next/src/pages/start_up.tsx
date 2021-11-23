import React, { ReactElement }  from 'react'
import Head from 'next/head'
import { GetStaticProps } from 'next';
import {Button} from '@material-ui/core'
import Link from 'next/link'

const StartUp = (): ReactElement => {
  return (
    <>
      <div>起動画面</div>
      <Link href="/movie">
        <Button>Moviesに移動</Button>
      </Link>
    </>
  );
};
export default StartUp;