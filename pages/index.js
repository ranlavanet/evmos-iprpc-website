import Head from "next/head";
import Hero from "../components/hero";
import Navbar from "../components/navbar";

const Home = () => {
  return (
    <>
      <Head>
        <title>Lava -Evmos ipRPC dapp</title>
        <meta
          name="description"
          content="decentralized application for reward distribution"
        />
        <link rel="icon" href="/img/logo.png" />
      </Head>
      <Navbar />
      <Hero />
    </>
  );
}

export default Home;