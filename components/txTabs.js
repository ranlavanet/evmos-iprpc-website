import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css'; // Import the default CSS styles for tabs
import FileInputComponent from "./fileInput";
import ParsedDataComponent from "./parsedJsonData"
import React, { useState } from 'react';
import InputChecker from "./fundInputChecker"
import Web3 from "web3"
import { LavaEvmosProviderPaymentContract__factory } from "../contract/typechain-types"
import { LavaEvmosProviderPaymentContract } from "../contract/typechain-types"
const EvmosTestnetGateway = "https://g.w.lavanet.xyz:443/gateway/evmost/json-rpc-http/9dbe4f2c6a0baba4cd27acb8ef3d7499"
const EvmosMainnetGateway = "https://g.w.lavanet.xyz:443/gateway/evmos/json-rpc-http/9dbe4f2c6a0baba4cd27acb8ef3d7499"
const EvmosTestnetContract = "0x02bBCa20734bEc605A9BBB87123253EB1975D1E1"
const EvmosMainnetContract = ""
const web3Provider = new Web3(EvmosTestnetGateway);
const contractAddress = EvmosTestnetContract; // Replace with your contract address
var fileInfo;
const TxTabs = () => {
    const [uploadedData, setUploadedData] = useState(null);
    const handleFileUpload = (data) => {
        setUploadedData(data);
        fileInfo = data;
    };
  return (
    <div className="max-w-2xl mb-8">
      <Tabs>
        <TabList>
          <Tab>Fund Account</Tab>
          <Tab>Pay Providers</Tab>
          <Tab>Change Backup Owner</Tab>
        </TabList>
        {/* Content for Tab 1 */}
        <TabPanel style={{ minHeight: '500px', minWidth: '500px'}}>
        <div>
            <InputChecker onButtonPress={async (inputValue) => {
                    console.log('Clicked', inputValue);
                    if (window.ethereum) {
                        if (window.ethereum.isConnected()) {
                            await window.ethereum.request({ method: 'eth_requestAccounts' })
                                .then(async (accounts) => {
                                const fromAccount = accounts[0];
                                console.log(inputValue)
                                const evmosAmount = Web3.utils.toWei(inputValue, 'milliether');
                                console.log(evmosAmount)
                                await window.ethereum.request({ 
                                    method: "eth_sendTransaction",
                                    params: [{
                                        from: fromAccount,
                                        to: contractAddress,
                                        value: evmosAmount,
                                    }],}).then((result) => {
                                        alert("tx sent Hash: " + String(result));
                                        console.log(result);
                                })
                                .catch((error) => {
                                console.error('MetaMask account access denied:', error);
                                });
                            }).catch((error) => {
                                console.error('MetaMask account access denied:', error);
                            })
                        } else {
                        alert("Metamask is not connected. Please connect and try again")
                        }
                    } else {
                        alert("metamask is not installed. please install metamask extension")
                    }
                }}>
            </InputChecker>
        </div>
        </TabPanel>
        {/* Content for Tab 2 (leave it empty) */}
        <TabPanel style={{ minHeight: '500px', minWidth: '500px' }}>
            <div className="max-w-2xl mb-8">
                <div className="flex flex-col items-start space-y-3 sm:space-x-4 sm:space-y-0 sm:items-center sm:flex-row" style={{ margin: '20px' }}>
                <div className="rounded-lg p-4 border border-gray-300" >
                    <FileInputComponent onFileUpload={handleFileUpload}/>
                </div>
                {uploadedData ? ( 
                    <button className="px-6 py-2 text-white bg-green-600 rounded-md md:ml-5" data={uploadedData}  onClick={async () => {
                            if (window.ethereum) {
                                if (window.ethereum.isConnected()) {
                                    const wallet = new Web3(window.ethereum);
                                    const myContract = new wallet.eth.Contract(LavaEvmosProviderPaymentContract__factory.abi, EvmosTestnetContract);
                                    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
                                    const fromAccount = accounts[0];
                                    const paymentListOfProviders = [];
                                    console.log(uploadedData)
                                    
                                    for (let item of  Object.getOwnPropertyNames(uploadedData)) {
                                        const evmosAmount = Web3.utils.toWei(uploadedData[item], 'ether');
                                        console.log("adding payee element", item, uploadedData[item], "eth amount", evmosAmount)
                                        paymentListOfProviders.push({name: item, value: evmosAmount})
                                    }
                                    const functionCallData = myContract.methods.payProviders(paymentListOfProviders).encodeABI();
                                    await window.ethereum.request({ 
                                        method: "eth_sendTransaction",
                                        params: [{
                                            from: fromAccount,
                                            to: contractAddress,
                                            data: functionCallData,
                                        }],}).then((result) => {
                                            alert("tx sent Hash: " + String(result));
                                            console.log(result);
                                    })
                                    .catch((error) => {
                                    console.error('MetaMask account access denied:', error);
                                    });
                                } else {
                                alert("Metamask is not connected. Please connect and try again")
                                }
                            } else {
                                alert("metamask is not installed. please install metamask extension")
                            }
                        }
                    }>
                    Launch Transaction
                    </button>
                ) : (
                    <div className="px-6 py-2 text-white bg-gray-600 rounded-md md:ml-5" style={{ cursor: 'not-allowed', pointerEvents: 'none', opacity: '0.6' }}>
                    <button disabled>
                    Upload File
                    </button>
                    </div>
                )}
                                
                </div>
                {uploadedData ? (
                <ParsedDataComponent data={uploadedData} /> // Use the component to showcase the parsed data
                ) : (
                ""
                )}
            </div>
        </TabPanel>
        {/* Content for Tab 3 (leave it empty) */}
        <TabPanel style={{ minHeight: '500px', minWidth: '500px' }}>
          <div></div>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default TxTabs;
