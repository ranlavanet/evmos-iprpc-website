import React, { useState, useEffect } from 'react';
import ParsedDataComponent from "./parsedJsonData"
import PaymentJsonShowBox from "./paymentJsonAmount"
import Web3 from "web3"
import { LavaEvmosProviderPaymentContract__factory } from "../contract/typechain-types"
import { ContractAddress } from "./utils"
import FileInputComponent from "./fileInput";
import EditableInputComponent from "./paymentAmount"

const PayProvidersComponent = () => {
    const [uploadedData, setUploadedData] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState(0);

    const handleFileUpload = (data) => {
        console.log("HAHAHAH2")
        console.log(data)
        setUploadedData(data);
    };
    const handleLaunchTransaction = async () => {
        await payProviders(uploadedData, paymentAmount);
    };

    const setData = (data) => {
        console.log("changing data", data.slice(0, 20))
        try {
            const parsedData = JSON.parse(data);
            console.log('Data is valid JSON:', parsedData);
            setUploadedData(parsedData);
          } catch (error) {
            console.error('Error parsing JSON:', error);
            // Handle the error, e.g., display an error message to the user
          }
    }

    useEffect(() => {
        // This useEffect will run when uploadedData changes
        console.log('Uploaded data has changed PayProvidersComponent:', uploadedData);
        setUploadedData(uploadedData);
    }, [uploadedData]);

    useEffect(() => {
        // This useEffect will run when uploadedData changes
        console.log('paymentAmount data has changed', paymentAmount);
        setPaymentAmount(paymentAmount)
    }, [paymentAmount]);

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
                <EditableInputComponent getDefaultAsyncValue={getCurrentContractFunds} onUpdate={(res)=>{setPaymentAmount(res)}}/>
            ) : (
                ""
            )}
            {uploadedData ? (
                <ParsedDataComponent data={uploadedData} setEditedData={setData}/>
            ) : (
                ""
            )}
            {uploadedData && paymentAmount != 0 ? (
                <PaymentJsonShowBox data={parseCsvFields(uploadedData, paymentAmount)}/>
            ) : (
                ""
            )}
            
        </div>
    );
};

export default PayProvidersComponent;

function parseCsvFields(uploadedData, amountToPay) {
    const paymentListOfProviders = [];
    const gatherInfo = [];
    let totalCu = 0;
    console.log("@@@@@@@@@", amountToPay)
    for (let i of uploadedData) {
        let address = i['Wallet Address']
        let totalCUs = i['Total CUs']
        console.log(address, totalCUs);
        if (!address || !totalCUs) {
            alert("couldn't find one of the fields 'Wallet Address' and 'Total CUs'");
            return
        }
        if (totalCUs == "") {
            continue;
        }
        try {
            totalCu += Number(totalCUs)
        } catch (e) {
            console.log("failed converting one of the elements", e)
            continue;
        }
        gatherInfo.push({address: address, totalCUs: totalCUs})
    }

    console.log("payment list", gatherInfo)
    console.log("totalCu", totalCu)

    let totalCoinsSending = 0
    let amountToPayWithSomeLeftOver = amountToPay / 1.001 // reduce a small amount from the contract so it wont overflow.
    for (let i of gatherInfo) {
        console.log("i.totalCus", i.totalCUs, "totalCu", totalCu, "amounttoPay", amountToPayWithSomeLeftOver)
        const value = amountToPayWithSomeLeftOver / (totalCu / i.totalCUs);
        console.log("value", value)
        totalCoinsSending += value;
        paymentListOfProviders.push({
            name: i.address,
            value: value,
        })
    }
    return paymentListOfProviders
}

async function getCurrentContractFunds() {
    try {
        const requestParams = {
            method: 'eth_getBalance',
            params: [ContractAddress, 'latest'], // 'latest' means to get the latest block
        };
        const balance = await window.ethereum.request(requestParams);
        // The balance is returned in Wei. 
        const balanceInEther = Web3.utils.fromWei(balance, 'ether');
        console.log(`Balance of the contract at address ${ContractAddress}: ${balanceInEther} ETH`);
        return balanceInEther;
    } catch (error) {
        console.error('Error getting contract balance:', error);
        return "failed fetching balance";
    }
}
async function payProviders(uploadedData, amountToPay) {
    if (window.ethereum) {
        if (window.ethereum.isConnected()) {
            const wallet = new Web3(window.ethereum);
            const myContract = new wallet.eth.Contract(LavaEvmosProviderPaymentContract__factory.abi, ContractAddress);
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
            const fromAccount = accounts[0];
            const paymentListOfProviders = [];
            const gatherInfo = [];
            let totalCu = 0;

            for (let i of uploadedData) {
                let address = i['Wallet Address']
                let totalCUs = i['Total CUs']
                console.log(address, totalCUs);
                if (!address || !totalCUs) {
                    alert("couldn't find one of the fields 'Wallet Address' and 'Total CUs'");
                    return
                }
                if (totalCUs == "") {
                    continue;
                }
                try {
                    totalCu += Number(totalCUs)
                } catch (e) {
                    console.log("failed converting one of the elements", e)
                    continue;
                }
                gatherInfo.push({address: address, totalCUs: totalCUs})
            }

            console.log("payment list", gatherInfo)
            console.log("totalCu", totalCu)

            let totalCoinsSending = 0
            let amountToPayWithSomeLeftOver = amountToPay / 1.001 // reduce a small amount from the contract so it wont overflow.
            for (let i of gatherInfo) {
                console.log("i.totalCus", i.totalCUs, "totalCu", totalCu, "amounttoPay", amountToPayWithSomeLeftOver)
                const value = amountToPayWithSomeLeftOver / (totalCu / i.totalCUs);
                console.log("value", value)
                totalCoinsSending += value;
                paymentListOfProviders.push({
                    name: i.address,
                    value: Web3.utils.toWei(String(value), 'ether'),
                })
            }
            console.log(totalCoinsSending)
            if (totalCoinsSending > amountToPay) {
                alert("bug sending payments")
                return;
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