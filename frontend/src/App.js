import "./App.css";
import { PeraWalletConnect } from "@perawallet/connect";
import algosdk, { waitForConfirmation } from "algosdk";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useEffect, useState } from "react";

//const crypto = require("crypto");

const peraWallet = new PeraWalletConnect();

// The app ID on testnet
// RPS app
const appIndex = 179316421;
const appAddress = "FTDWBFEDBF4LM7MBN7F5YXCO3LQSFFOLSROJXX57OGBDSIGDO2P2DNCJFM";

// connect to the algorand node
// token, address(server), port
const algod = new algosdk.Algodv2(
  "",
  "https://testnet-api.algonode.cloud",
  443
);

function App() {
  const [accountAddress, setAccountAddress] = useState(null);
  const [owner, setOwner] = useState(null);
  const [realhand, setRealHand] = useState(null);
  const [hashedhand, setHashedHand] = useState(null);
  const [realguess, setRealGuess] = useState(null);
  const [hashedguess, setHashedGuess] = useState(null);

  const isConnectedToPeraWallet = !!accountAddress; //convert string to boolean

  useEffect(() => {
    // Reconnect to the session when the component is mounted
    peraWallet
      .reconnectSession()
      .then((accounts) => {
        peraWallet.connector.on("disconnect", handleDisconnectWalletClick);
        console.log(accounts);
        if (accounts.length) {
          setAccountAddress(accounts[0]);
        }
      })
      .catch((e) => console.log(e));
  }, []);

  return (
    <Container>
      <meta name="name" content="Testing frontend for PyTeal" />
      <h1> Test frontend for PyTeal</h1>
      <Row>
        <Col>
          <Button
            onClick={
              isConnectedToPeraWallet
                ? handleDisconnectWalletClick
                : handleConnectWalletClick
            }
          >
            {isConnectedToPeraWallet ? "Disconnect" : "Connect to Pera Wallet"}
          </Button>
        </Col>
      </Row>
      <br />
      <Row>
        <Col>
          <Button onClick={() => optInRpsApp()}>OptIn</Button>
        </Col>
      </Row>
      <br />
      <Row>
        <Col>
          <Button onClick={() => setOwner(true)}>Start Game</Button>
        </Col>
        <Col>
          <Button onClick={() => setOwner(false)}>Join Game</Button>
        </Col>
        <Col>
          <Button onClick={() => resolveRpsApplication()}>Resolve Game</Button>
        </Col>
      </Row>
      <br />
      <Row>
        <Col>
        <h5> Number of fingers which you raise:</h5>
        <Button
           onClick={
            !!owner === true

            ? () =>{
            
              setHashedHand("a4ayc/80/OGda4BO/1o/V0etpOqiLx1JwB5S3beHW0s=");
              setRealHand(1);
            
          }
          : () => setRealHand(1)
        }
           >
            One
          </Button>

            One
        
          
        </Col>
        <br />

        <Col>
        <Button
            onClick={
              !!owner === true
              ? () =>{
            
                setHashedHand("1HNeOiZeFu7gP1lxi5tdAwGcB9i2xR+Q2jpmbuwTqzU=");
                setRealHand(2);
              
            }
            : () => setRealHand(2)
            }
          >
            Two
          </Button>
        </Col>
        <br />

        <Col>
        <Button
            onClick={
              !!owner === true
              ? () =>{
            
                setHashedHand("TgdAhWK+24tgzgXB3s/jrRa3IjCWfeAfZAt+Rym0n84=");
                setRealHand(3);
              
            }
            : () => setRealHand(3)
            }
          >
            Three
          </Button>
        </Col>
        <br />

      
        <Col>
        <Button
            onClick={
              !!owner === true
              ? () =>{
            
                setHashedHand("SyJ3d9TdH8Ycb4hPSGQdArTRIdP9Moywi1Ux/Kzav4o=");
                setRealHand(4);
              
            }
            : () => setRealHand(4)
            }
          >
            Four
          </Button>
        
        
        </Col>
      
        
        <br />

        <Col>
        <Button
            onClick={
              !!owner === true
              ? () =>{
            
                setHashedHand("7y0SfeN7lCuq0GFF5UsMYZofIjJ7LrvPvsePVWSv450=");
                setRealHand(5);
              
            }
            : () => setRealHand(5)
            }
          >
            Five
          </Button>
        
        
        </Col>
        <br />

    
      <Col>
      <h5> Guess the number of raised fingers:</h5>
      <Button
            onClick={
              !!owner === true
                ? () =>
                    startRpsApplication(
                      "1HNeOiZeFu7gP1lxi5tdAwGcB9i2xR+Q2jpmbuwTqzU=",
                      2,
                     
                    )
                : () => joinRpsApplication(2)
            }
          >
            Two
          </Button>
          <br />
        <br />
        
        
          <Button
            onClick={
              !!owner === true
              ? () =>
              startRpsApplication(
                "TgdAhWK+24tgzgXB3s/jrRa3IjCWfeAfZAt+Rym0n84=",
                3,
               
              )
          : () => joinRpsApplication(3)
            }
          >
            Three
          </Button>
        
          
          <br />
          <br />
          
          <Button
            onClick={
              !!owner === true
              ? () =>
              startRpsApplication(
                "SyJ3d9TdH8Ycb4hPSGQdArTRIdP9Moywi1Ux/Kzav4o=",
                4,
               
              )
          : () => joinRpsApplication(4)
            }
          >
            Four
          </Button>
        
        <br />
        <br />
        
          <Button
            onClick={
              !!owner === true
              ? () =>
              startRpsApplication(
                "7y0SfeN7lCuq0GFF5UsMYZofIjJ7LrvPvsePVWSv450=",
                5,
               
              )
          : () => joinRpsApplication(5)
            }
          >
            Five
          </Button>
        
        <br />
        <br />
        
          <Button
            onClick={
              !!owner === true
              ? () =>
              startRpsApplication(
                "5/bAEXdujbfNMwtUF0/Xb30CFrYSOHpf/PuB5vCRloM=",
                6,
               
              )
          : () => joinRpsApplication(6)
            }
          >
            Six
          </Button>
        
        <br />
        <br />
  
 
          <Button
            onClick={
              !!owner === true
              ? () =>
              startRpsApplication(
                "eQJpm+Qsio5G+7tFAXJlF+hrIsVqGJ92JabaSQgbJFE=",
                7,
               
              )
          : () => joinRpsApplication(7)
            }
          >
            Seven
          </Button>
        
          
          <br />
          <br />
          
          <Button
            onClick={
              !!owner === true
              ? () =>
              startRpsApplication(
                "LGJCMs3SIXcSlN+7MQrKAAoN9qyLZraW2Q7wb977ZKM=",
                8,
               
              )
          : () => joinRpsApplication(8)
            }
          >
            Eight
          </Button>
        
        <br />
        <br />
        
          <Button
            onClick={
              !!owner === true
              ? () =>
              startRpsApplication(
                "GVgeJ9587QD/HOULIEfnpWfHaxy666vl7wP3wwF7tbc=",
                9,
               
              )
          : () => joinRpsApplication(9)
            }
          >
            Nine
          </Button>
        
        <br />
        <br />
        
          <Button
            onClick={
              !!owner === true
              ? () =>
              startRpsApplication(
                "SkTcFTZCBKgP6A6QOUVcwWCCgYIP4rJPHlIzreavHdU=",
                10,
               
              )
          : () => joinRpsApplication(10)
            }
          >
            Ten
          </Button>
        
    </Col>
    </Row>
    </Container>
  );

  function handleConnectWalletClick() {
    peraWallet
      .connect()
      .then((newAccounts) => {
        peraWallet.connector.on("disconnect", handleDisconnectWalletClick);
        setAccountAddress(newAccounts[0]);
      })
      .catch((error) => {
        if (error?.data?.type !== "CONNECT_MODAL_CLOSED") {
          console.log(error);
        }
      });
  }

  function handleDisconnectWalletClick() {
    peraWallet.disconnect();
    setAccountAddress(null);
  }

  async function optInRpsApp() {
    try {
      // get suggested params
      const suggestedParams = await algod.getTransactionParams().do();

      const actionTx = algosdk.makeApplicationOptInTxn(
        accountAddress,
        suggestedParams,
        appIndex
      );

      const actionTxGroup = [{ txn: actionTx, signers: [accountAddress] }];

      const signedTx = await peraWallet.signTransaction([actionTxGroup]);
      console.log(signedTx);
      const { txId } = await algod.sendRawTransaction(signedTx).do();
      const result = await waitForConfirmation(algod, txId, 2);
    } catch (e) {
      console.error(`There was an error calling the rps app: ${e}`);
    }
  }

  async function startRpsApplication(
    hashedguess = "1HNeOiZeFu7gP1lxi5tdAwGcB9i2xR+Q2jpmbuwTqzU=",
    guess = "2"
  ) {
    try {
      setRealGuess(guess);
      // get suggested params
      const suggestedParams = await algod.getTransactionParams().do();
      const appArgs = [
        new Uint8Array(Buffer.from("start")),
        new Uint8Array(Buffer.from(hashedhand, "base64")),
      ];

      const accounts = [
        "5AWWZNFOGREPTSZ3IWZRC3DCFIIMJEFR4VVKXQQKWBAJNPEBYFPFEQL3P4",
      ];

      let actionTx = algosdk.makeApplicationNoOpTxn(
        accountAddress,
        suggestedParams,
        appIndex,
        appArgs,
        accounts
      );

      let payTx = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: accountAddress,
        to: appAddress,
        amount: 100000,
        suggestedParams: suggestedParams,
      });

      let txns = [actionTx, payTx];
      algosdk.assignGroupID(txns);

      const actionTxGroup = [
        { txn: actionTx, signers: [accountAddress] },
        { txn: payTx, signers: [accountAddress] },
      ];

      const signedTxns = await peraWallet.signTransaction([actionTxGroup]);

      console.log(signedTxns);
      const { txId } = await algod.sendRawTransaction(signedTxns).do();
      const result = await waitForConfirmation(algod, txId, 4);
      // checkCounterState();
    } catch (e) {
      console.error(`There was an error calling the rps app: ${e}`);
    }
  }

  async function joinRpsApplication(guess) {
    try {
      const playerOne = new Uint8Array(1);
      playerOne[0] = realhand;
      const playerTwo = new Uint8Array(1);
      playerTwo[0] = guess;

      // get suggested params
      const suggestedParams = await algod.getTransactionParams().do();
      const appArgs = [
        new Uint8Array(Buffer.from("accept")),
        playerOne,
        playerTwo
      ];

      const accounts = [
        "ISPX7MX35NV6PIVNFSZNIZ6QCHQM5JZTZT3QOV742BEFZL2Y7ELQ4AO4JM",
      ];

      let actionTx = algosdk.makeApplicationNoOpTxn(
        accountAddress,
        suggestedParams,
        appIndex,
        appArgs,
        accounts
      );

      let payTx = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: accountAddress,
        to: appAddress,
        amount: 100000,
        suggestedParams: suggestedParams,
      });

      let txns = [actionTx, payTx];
      algosdk.assignGroupID(txns);

      const actionTxGroup = [
        { txn: actionTx, signers: [accountAddress] },
        { txn: payTx, signers: [accountAddress] },
      ];

      const signedTxns = await peraWallet.signTransaction([actionTxGroup]);

      console.log(signedTxns);
      const { txId } = await algod.sendRawTransaction(signedTxns).do();
      const result = await waitForConfirmation(algod, txId, 4);
      // checkCounterState();
    } catch (e) {
      console.error(`There was an error calling the rps app: ${e}`);
    }
  }

  // RESOLVE RPS WINNER
  async function resolveRpsApplication() {
    try {
      // get suggested params
      const suggestedParams = await algod.getTransactionParams().do();
      const appArgs = [
        new Uint8Array(Buffer.from("resolve")),
        new Uint8Array(Buffer.from(realhand.toString())),
        new Uint8Array(Buffer.from(realguess.toString()))

      ];

      const accounts = [
        "5AWWZNFOGREPTSZ3IWZRC3DCFIIMJEFR4VVKXQQKWBAJNPEBYFPFEQL3P4",
      ];

      let actionTx = algosdk.makeApplicationNoOpTxn(
        accountAddress,
        suggestedParams,
        appIndex,
        appArgs,
        accounts
      );

      const actionTxGroup = [{ txn: actionTx, signers: [accountAddress] }];

      const signedTxns = await peraWallet.signTransaction([actionTxGroup]);
      const txns = [signedTxns];

      console.log(signedTxns);

      //const dr = algosdk.createDryrun(algod, txns);

      //test debugging
      //const dryRunResult = await algod.dryrun(dr).do();
      //console.log(dryRunResult);

      const { txId } = await algod.sendRawTransaction(signedTxns).do();
      const result = await waitForConfirmation(algod, txId, 4);
      console.log(result);
    } catch (e) {
      console.error(`There was an error calling the rps app: ${e}`);
    }
  }

  // Clear state
  // {
  //   "txn": {
  //     "apan": 3,
  //     "apid": 51,
  //     "fee": 1000,
  //     "fv": 13231,
  //     "gh": "ALXYc8IX90hlq7olIdloOUZjWfbnA3Ix1N5vLn81zI8=",
  //     "lv": 14231,
  //     "note": "U93ZQy24zJ0=",
  //     "snd": "LNTMAFSF43V7RQ7FBBRAWPXYZPVEBGKPNUELHHRFMCAWSARPFUYD2A623I",
  //     "type": "appl"
  //   }
  // }
}

export default App;
