import React, {useState} from 'react';
import {digestMessage} from '../../hashSHA265File';
const parseString = require('xml2js').parseString;

const corsProxy = 'https://cors.3cstop.workers.dev/?';

export default function Verif() {
  const [hash, setHash] = useState('');
  const [referenceNo, setReferenceNo] = useState('');
  const [UPOhash, setUPOhash] = useState('');
  const [upo, setUpo] = useState();
  const [upoStatus, setUpoStatus] = useState('');

  const handleFile = async (e) => {
    let reader = new FileReader();
    reader.readAsArrayBuffer(e.target.files[0]);
    reader.onload = async function () {
      const digestHex = await digestMessage(reader.result);
      setHash(digestHex);
    };
    reader.onerror = function () {
      console.log(reader.error);
      setHash('błąd :( ');
    };
  };
  const handleReferenceNo = ({target}) => {
    setReferenceNo(target.value);
  };

  const handleSubmit = (e, type) => {
    e.preventDefault();
    getUPO(referenceNo, type);
  };

  async function getUPO(referenceNo, type) {
    setUPOhash('');
    setUpo('');
    setUpoStatus('');
    const req = await fetch(
      `${corsProxy}https://${
        type === 'test' ? 'test-' : ''
      }e-dokumenty.mf.gov.pl/api/Storage/Status/${referenceNo}`
    );
    const resp = await req.json();
    resp.Description && setUpoStatus(resp.Description);
    if (resp.Upo) {
      parseString(resp.Upo, function (err, result) {
        console.log(result["ds:Signature"]["ds:Object"]);
        // console.log(result["ds:Signature"]["ds:Object"][1].Potwierdzenie[0]);
        const potwierdzenie =
          result['ds:Signature']['ds:Object'][1].Potwierdzenie ? result['ds:Signature']['ds:Object'][1].Potwierdzenie[0] : result['ds:Signature']['ds:Object'][0].Potwierdzenie[0] ;
        const skrotDokumentu = potwierdzenie.SkrotDokumentu[0].match(
          /(?<=\[).+?(?=\])/gm
        )[0];
        setUpo(potwierdzenie);
        setUPOhash(skrotDokumentu);
      });
    }
  }

  return (
    <>
      <div className="block">
        <input type="file" onChange={(e) => handleFile(e)} />
        <label htmlFor="fileHash">Skrót załączonego pliku XML</label>
        <input
          id="fileHash"
          type="text"
          disabled
          value={hash}
          style={{color: hash === UPOhash ? 'green' : 'red'}}
        />
      </div>
      <div className="block">
        <label htmlFor="nrUPO">Nr referencyjny (UPO):</label>
        <input
          id="nrUPO"
          placeholder="Nr referencyjny..."
          onChange={handleReferenceNo}
          value={referenceNo}
          type="text"
        />
        <div>
          <button onClick={handleSubmit} disabled={referenceNo.length !== 32}>
            Pobierz UPO
          </button>
          <button
            onClick={(e) => handleSubmit(e, 'test')}
            disabled={referenceNo.length !== 32}
          >
            Pobierz UPO z bamki TEST
          </button>
        </div>
        <input value={upoStatus} disabled placeholder="Status" />

        <label>Skrót złożonego dokumentu pobrany z UPO:</label>
        <input
          type="text"
          disabled
          value={UPOhash}
          style={{color: hash === UPOhash ? 'green' : 'red'}}
        />
        <textarea disabled value={JSON.stringify(upo, null, 2)} />
      </div>
    </>
  );
}
