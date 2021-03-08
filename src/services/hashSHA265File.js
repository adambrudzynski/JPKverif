export  async function hashSHA256File(e) {
  const file = e.target.files[0];
  let reader = new FileReader();

  reader.readAsArrayBuffer(file);
  reader.onload = async function () {
    const digestHex = await digestMessage(reader.result);
    console.log('hashSHA256File onload result: ', digestHex);
    return digestHex;
  };
  reader.onerror = function () {
    console.log(reader.error);
  };
}

export async function digestMessage(message) {
  const hashBuffer = await crypto.subtle.digest('SHA-256', message); 
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return hexToBase64(hashHex);
}


function hexToBase64(str) {
  return btoa(String.fromCharCode.apply(null,
    str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" "))
  );
}

function base64ToHex(str) {
  for (var i = 0, bin = atob(str.replace(/[ \r\n]+$/, "")), hex = []; i < bin.length; ++i) {
    var tmp = bin.charCodeAt(i).toString(16);
    if (tmp.length === 1) tmp = "0" + tmp;
    hex[hex.length] = tmp;
  }
  return hex.join(" ");
}

// function Hex2Bin(n){if(!checkHex(n))return 0;return parseInt(n,16).toString(2)}
// function checkBin(n){return/^[01]{1,64}$/.test(n)}
// function checkDec(n){return/^[0-9]{1,64}$/.test(n)}
// function checkHex(n){return/^[0-9A-Fa-f]{1,64}$/.test(n)}
// function pad(s,z){s=""+s;return s.length<z?pad("0"+s,z):s}
// function unpad(s){s=""+s;return s.replace(/^0+/,'')}

// //Decimal operations
// function Dec2Bin(n){if(!checkDec(n)||n<0)return 0;return n.toString(2)}
// function Dec2Hex(n){if(!checkDec(n)||n<0)return 0;return n.toString(16)}

// //Binary Operations
// function Bin2Dec(n){if(!checkBin(n))return 0;return parseInt(n,2).toString(10)}
// function Bin2Hex(n){if(!checkBin(n))return 0;return parseInt(n,2).toString(16)}

// //Hexadecimal Operations
// // function Hex2Bin(n){if(!checkHex(n))return 0;return parseInt(n,16).toString(2)}
// function Hex2Dec(n){if(!checkHex(n))return 0;return parseInt(n,16).toString(10)}