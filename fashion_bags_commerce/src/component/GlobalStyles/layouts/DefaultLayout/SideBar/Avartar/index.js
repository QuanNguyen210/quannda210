import { Card } from 'antd';
import Meta from 'antd/es/card/Meta';
import { useState } from 'react';
import Constants from '~/Utilities/Constants';
import { getStaff } from '~/api/auth/helper/UserCurrent';
const CryptoJS = require('crypto-js');
function Avartar() {
  const [staff, setStaff] = useState(getStaff());

  return (
    <div style={{ padding: '0px 0px 60px 0px' }}>
      <br />

      <Card
        hoverable
        style={{
          width: 200,
          height: 180,
          padding: '0px 0px 10px 0px',
          backgroundColor: 'lightcyan',
          borderRadius: '20% 5% 20% 5%',
        }}
        cover={
          <img
            alt="avatar shop"
            style={{ width: '180px', height: '160px', borderRadius: '20% 5% 20% 5%', margin: '10px 10px 10px 10px' }}
            src="https://firebasestorage.googleapis.com/v0/b/bagsgirl-datn.appspot.com/o/Image%2Flogo.png?alt=media&token=5eac10cf-5998-459a-90ab-9ae86c0c631e"
          />
        }
      >
        <Meta title="Bags Girls Shop" description={staff ? staff.users.fullName : ''} />
      </Card>
    </div>
  );
}

export default Avartar;
