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
    // console.log("hexToBase64", hexToBase64(hashHex));
  return hexToBase64(hashHex);
}

export function arbuf2hex(buffer) { //same result as digestMessage()
  var hexCodes = [];
  var view = new DataView(buffer);
  for (var i = 0; i < view.byteLength; i += 4) {
    // Using getUint32 reduces the number of iterations needed (we process 4 bytes each time)
    var value = view.getUint32(i)
    // toString(16) will give the hex representation of the number without padding
    var stringValue = value.toString(16)
    // We use concatenation and slice for padding
    var padding = '00000000'
    var paddedValue = (padding + stringValue).slice(-padding.length)
    hexCodes.push(paddedValue);
  }

  // Join all the hex strings into one
  console.log("arbuf2hex", hexCodes.join(""));
  return hexCodes.join("");
}

export function sha256(hexstr) {
  // We transform the string into an arraybuffer.
  var buffer = new Uint8Array(hexstr.match(/[\da-f]{2}/gi).map(function (h) {
    return parseInt(h, 16)
  }));
  return crypto.subtle.digest("SHA-256", buffer).then(function (hash) {
    return arbuf2hex(hash);
  });
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

function Hex2Bin(n){if(!checkHex(n))return 0;return parseInt(n,16).toString(2)}
function checkBin(n){return/^[01]{1,64}$/.test(n)}
function checkDec(n){return/^[0-9]{1,64}$/.test(n)}
function checkHex(n){return/^[0-9A-Fa-f]{1,64}$/.test(n)}
function pad(s,z){s=""+s;return s.length<z?pad("0"+s,z):s}
function unpad(s){s=""+s;return s.replace(/^0+/,'')}

//Decimal operations
function Dec2Bin(n){if(!checkDec(n)||n<0)return 0;return n.toString(2)}
function Dec2Hex(n){if(!checkDec(n)||n<0)return 0;return n.toString(16)}

//Binary Operations
function Bin2Dec(n){if(!checkBin(n))return 0;return parseInt(n,2).toString(10)}
function Bin2Hex(n){if(!checkBin(n))return 0;return parseInt(n,2).toString(16)}

//Hexadecimal Operations
// function Hex2Bin(n){if(!checkHex(n))return 0;return parseInt(n,16).toString(2)}
function Hex2Dec(n){if(!checkHex(n))return 0;return parseInt(n,16).toString(10)}