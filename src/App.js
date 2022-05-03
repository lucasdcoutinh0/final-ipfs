import {Buffer} from 'buffer';
import { create } from "ipfs-http-client"
import {useState} from 'react'

function App() {

  const [file, setFile] = useState(null);
  const [hash, setHash] = useState();
  const ipfs = create('https://ipfs.infura.io:5001');


  const retrieveFile = (e) => {
    const data = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      console.log("Buffer data: ", Buffer(reader.result))
      setFile(Buffer(reader.result));
    }
    e.preventDefault();  
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const post = ipfs.add(file)
    .then(post => {
      setHash(`https://ipfs.io/ipfs/${post.path}`)
      console.log(post.path)
    })
  };
  return (
    <div className="App">
      <form className="form">
        <input type="file" name="data" onChange={retrieveFile} />
        <button type="submit" className="btn" onClick={handleSubmit}>Upload file</button>
      </form>
      <div className="display">
        <img src={hash} alt=''></img>
      </div>
    </div>
  );
}

export default App;
