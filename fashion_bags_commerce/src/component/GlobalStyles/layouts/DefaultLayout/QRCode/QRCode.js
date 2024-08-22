import { Fragment, useEffect, useState } from 'react';

import { Html5Qrcode, Html5QrcodeScanner } from 'html5-qrcode';

function QRCodeScanner() {
  const [data, setData] = useState('');
  const [showScanner, setShowScanner] = useState(true);

  const qrcodeId = 'reader';
  let html5QrCode;

  useEffect(() => {
    // Anything in here is fired on component mount.
    if (!html5QrCode?.getState()) {
      html5QrCode = new Html5Qrcode(qrcodeId);
      const qrCodeSuccessCallback = (decodedText, decodedResult) => {
        /* handle success */
        console.log('====================================');
        console.log(decodedText);
        console.log(decodedResult);
        console.log('====================================');
        html5QrCode?.clear();
      };
      const config = { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.777778 };

      // If you want to prefer back camera
      html5QrCode.start({ facingMode: 'environment' }, config, qrCodeSuccessCallback);
    }

    return () => {
      // Anything in here is fired on component unmount.
    };
  }, []);
  const divStyle = {
    display: showScanner ? 'block' : 'none', // Hiển thị hoặc ẩn khung quét
    width: '250px',
    height: '250px',
    backgroundColor: 'lightblue',
    border: '1px solid black',
    borderRadius: '5px',
  };

  return (
    <Fragment>
      <div id={qrcodeId} style={divStyle}></div>
      <p>{data}</p>
    </Fragment>
  );
}

export default QRCodeScanner;
