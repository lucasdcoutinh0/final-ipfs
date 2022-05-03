import {Buffer} from 'buffer';
import { create } from "ipfs-http-client"
import {useState} from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './index.css'
import SimpleStorage_abi from './contracts/SimpleSotage_abi.json'
import { ethers } from "ethers";

function App() {

  const [file, setFile] = useState(null);
  const ipfs = create('https://ipfs.infura.io:5001');
  const [contract, setContract] = useState()
  const [image, setImage] = useState();
  const [visibility, setVisibility] = useState({visibility: 'hidden', color: 'white'});
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null)
  const [buttonText, setButtonText] = useState('Connect With Metamask')
  const [owner, setOwner] = useState(null)

  const connectWalletHandler = () => {
    if (window.ethereum) {
      window.ethereum.request({method: 'eth_requestAccounts'})
      .then(result => {
        accountChangeHandler(result[0])
      })
    } else {
      setErrorMessage('Install Metamask')
    }
  }

  const accountChangeHandler = async (newAccount) => {
    setDefaultAccount(newAccount);
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        await provider.send("eth_requestAccounts", [])
        const tempSigner = provider.getSigner()
        setOwner(await tempSigner.getAddress())
        const tempContract = new ethers.Contract('0xCDd1BF8138FC19d6413c869bE597cac3257472E8', SimpleStorage_abi, tempSigner)
        setContract(tempContract)
        setImage(await tempContract.getHash())
        setVisibility({visibility: 'visible', color: 'white'})
        setButtonText('Connected')
  }
  const retrieveFile = (e) => {
    const data = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = async () => {
      console.log("Buffer data: ", Buffer(reader.result))
      setFile(Buffer(reader.result))
    }
    e.preventDefault();  
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const post = ipfs.add(file)
    .then(async (post) => {
      const set = await contract.setHash(post.path)
      .then((set) => {
        console.log(set.hash)
        window.location.reload();
      })
    })
  };

     

  return (
    <div className="body">
      <div>
        <h1 className="title">IPFS + ETHEREUM</h1>
      </div>
      <div className="title pt-5">
      <div>
      <label className="title">Connect With Metamask to Interact with the ipfs and SmartContract</label>
      </div>
      <div className="pt-5">
      <Button variant="light" onClick={connectWalletHandler}>{buttonText}</Button>
      </div>
      </div>
      <div className='pt-5'>
      <form className="title">
        <div className="title pb-5">
        <label style={visibility}>Upload and Submit a file to update the SmartContract</label>
        </div>
        <input type="file" name="data" style={visibility} onChange={retrieveFile} />
        <button type="submit" style={visibility} className="btn" onClick={handleSubmit}>Upload file</button>
      </form>
      </div>
      <div>
        <img id='imgElement' src={`https://ipfs.io/ipfs/${image}`} alt=""></img>
      </div>
    </div>
  );
}

export default App;
