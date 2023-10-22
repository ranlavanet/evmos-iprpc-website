import Head from "next/head";
import Hero from "../components/heroConnected";
import Navbar from "../components/navbarTxPage";

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