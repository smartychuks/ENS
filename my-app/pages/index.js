import Head from "next/head";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { ethers, providers } from "ethers";
import { useEffect, useRef, useState } from "react";

export default function Home(){
  // keep track of user's wallet connection status
  const [walletConnected, setWalletConnected] = useState(false);
  // Reference to web3modal
  const web3ModalRef = useRef();
  const [ens, setENS] = useState("");
  // save address of the currently connected account
  const [address, setAddress] = useState("");

  const setENSOrAddress = async (address, web3Provider) => {
    // search for the ENS related to the given address
    var _ens = await web3Provider.lookupAddress(address);
    if(_ens){// If address has an ENS then set it else set address
      setENS(_ens);
    }else{
      setAddress(address);
    }
  };

  const getProviderOrSigner = async () => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    // alert users not connected to Goerli network
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 5){
      window.alert("Change the network to Goerli");
      throw new error("Change network to Goerli");
    }
    const signer = web3Provider.getSigner();
    const address = await signer.getAddress();
    await setENSOrAddress(address, web3Provider);
    return signer;    
  };

  const connectWallet = async () => {
    try {
      await getProviderOrSigner(true);
      setWalletConnected(true);
    } catch (error) {
      console.error(error);
    }
  };

  const renderButton = () => {
    if (walletConnected){
      <div>Wallet Connected</div>;
    }else{
      return(
        <button onClick={connectWallet} className={styles.button}>
          Connect your wallet
        </button>
      );
    }
  };

  useEffect(() => {
    if(!walletConnected){
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected]);

  return (
    <>
    <div>
      <Head>
        <title>ENS Dapp</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>
            Welcome to De Punks {ens ? ens : address}!
          </h1>
          <div className={styles.description}>
            Its an NFT collection for De Punks.
          </div>
          {renderButton()}
        </div>
      </div>
        <img className={styles.image} src="./learnweb3punks.png" />
    </div>

    <footer className={styles.footer}>
      Made with &#10084; by iSmarty for De Punks
    </footer>
    </>
  );
}