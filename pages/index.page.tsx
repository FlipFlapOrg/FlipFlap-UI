import type { GetServerSideProps, NextPage } from 'next'

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      permanent: false,
      destination: '/viewer',
    },
  }
}

const Home: NextPage = () => {
  return <div>expected no view</div>
}

export default Home
