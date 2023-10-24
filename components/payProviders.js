import React, { useState, useEffect } from 'react';
import ParsedDataComponent from "./parsedJsonData"
import Web3 from "web3"
import { LavaEvmosProviderPaymentContract__factory } from "../contract/typechain-types"
import { ContractAddress } from "./utils"
import FileInputComponent from "./fileInput";

const PayProvidersComponent = () => {
    var latestData;
    const [uploadedData, setUploadedData] = useState(null);

    const handleFileUpload = (data) => {
        console.log("HAHAHAH2")
        console.log(data)
        setUploadedData(data);
    };
    const handleLaunchTransaction = async () => {
        await payProviders(latestData);
    };

    const setData = (data) => {
        console.log("changing data", data.slice(0, 20))
        latestData = data;
    }

    useEffect(() => {
        // This useEffect will run when uploadedData changes
        console.log('Uploaded data has changed PayProvidersComponent:', uploadedData);
        latestData = uploadedData;
    }, [uploadedData]);

    return (
        <div className="max-w-2xl mb-8">
            <div className="flex flex-col items-start space-y-3 sm:space-x-4 sm:space-y-0 sm:items-center sm:flex-row" style={{ margin: '20px' }}>
                <div className="rounded-lg p-4 border border-gray-300">
                    <FileInputComponent onFileUpload={handleFileUpload} />
                </div>
                {uploadedData ? (
                    <button
                        className="px-6 py-2 text-white bg-green-600 rounded-md md:ml-5"
                        data={uploadedData}
                        onClick={handleLaunchTransaction}
                    >
                        Launch Transaction
                    </button>
                ) : (
                    <div
                        className="px-6 py-2 text-white bg-gray-600 rounded-md md:ml-5"
                        style={{ cursor: 'not-allowed', pointerEvents: 'none', opacity: '0.6' }}
                    >
                        <button disabled>
                            Upload File
                        </button>
                    </div>
                )}
            </div>
            {uploadedData ? (
                <ParsedDataComponent data={uploadedData} setEditedData={setData} />
            ) : (
                ""
            )}
        </div>
    );
};

export default PayProvidersComponent;

async function payProviders(uploadedData) {
    if (window.ethereum) {
        if (window.ethereum.isConnected()) {
            const wallet = new Web3(window.ethereum);
            const myContract = new wallet.eth.Contract(LavaEvmosProviderPaymentContract__factory.abi, ContractAddress);
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
                    to: ContractAddress,
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