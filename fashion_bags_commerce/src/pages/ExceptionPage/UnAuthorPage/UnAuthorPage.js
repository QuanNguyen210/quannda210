import { Button } from 'antd';
import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';

function UnAuthorPage() {
  const navigate = useNavigate();
  return (
    <Fragment>
      <h2>Bạn ko có quyền truy cập trang này !!!</h2>
      <hr></hr>

      <div>
        <Button
          onClick={() => {
            navigate('/login');
          }}
        >
          Quay lại Trang Login
        </Button>
      </div>
      <hr></hr>
      <div>
        <Button
          onClick={() => {
            navigate('/admin');
          }}
        >
          Quay lại Dashboard
        </Button>
      </div>
    </Fragment>
  );
}

export default UnAuthorPage;
