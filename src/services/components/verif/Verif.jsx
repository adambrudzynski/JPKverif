import React, {useState} from 'react';
import {digestMessage, sha256, arbuf2hex} from '../../hashSHA265File';

export default function Verif() {
  const [hash, setHash] = useState();

   const handleFile = async (e) => {
    let reader = new FileReader();
    reader.readAsArrayBuffer(e.target.files[0]);
    reader.onload = async function () {
      const digestHex = await digestMessage(reader.result);
      console.log('hashSHA256File onload result: ', digestHex); 
      setHash(digestHex);
    };
    reader.onerror = function () {
      console.log(reader.error);
      setHash('błąd :( ');
    };
  };

  return (
    <div>
      <input type="file" onChange={(e) => handleFile(e)} />
      <p>hash: {hash}</p>
      <p>2n6S3ztH3oogOgmftFZOIFWOcRpmaSSWQ3SYiEnGpew=</p>
      <input type="text" />
    </div>
  );
}
