import Head from "next/head";
import Hero from "../components/heroConnected";
import Navbar from "../components/navbarTxPage";
import SectionTitle from "../components/sectionTitle";

// import { benefitOne, benefitTwo } from "../components/data";
// import Video from "../components/video";
// import Benefits from "../components/benefits";
// import Footer from "../components/footer";
// import Testimonials from "../components/testimonials";
// import Cta from "../components/cta";
// import Faq from "../components/faq";
// import PopupWidget from "../components/popupWidget";

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