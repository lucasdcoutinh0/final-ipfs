#IPFS + BLOCKCHAIN

The purpose of this small dapp is to create a full decentralized way to store files.

#How this Works ?

- First of all we need to send the file to the IPFS, after that we gonna recieve a hash that lead us to our file.
- After that we gonna store this hash into the blockchain using the "setHash()" function of the SmartContract
- When the transaction with MetaMask ends the file will be stored on the SmartContract "0xCDd1BF8138FC19d6413c869bE597cac3257472E8" deployed on the rinkeby network 
- To get the image you only need to get the hash using the function "getHash()" and add to the end of the ipfs address `https://ipfs.io/ipfs/{IPFS HASH}`



