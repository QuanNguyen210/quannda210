import React, { Fragment } from 'react';
import Header from '../Header';
import Footer from '../Footer';
import { RightOutlined } from '@ant-design/icons';
import MainLayout from '../MainLayout';

const AboutPage = () => {
  const Breadcrumb = ({ steps }) => {
    return (
      <div className="breadcrumb">
        {steps.map((step, index) => (
          <Fragment key={index}>
            <span>{step}</span>
            {index !== steps.length - 1 && (
              <span>
                {' '}
                <RightOutlined style={{ fontSize: '14px' }} />{' '}
              </span>
            )}
          </Fragment>
        ))}
      </div>
    );
  };

  const steps = ['Trang chủ', 'Giới thiệu'];
  return (
    <MainLayout>
      <div style={{textAlign:'center'}}>
      <Breadcrumb steps={steps} />
      <h1>Giới thiệu về Website Bán Balo Thời Trang</h1>
      <p>
        Chào mừng bạn đến với website bán balo thời trang của chúng tôi! Chúng tôi cung cấp các sản phẩm balo chất lượng
        cao, đa dạng về kiểu dáng và màu sắc để đáp ứng nhu cầu của mọi người.
      </p>
      <p>
        Chúng tôi cam kết mang đến cho khách hàng những sản phẩm chất lượng, dịch vụ tốt nhất cùng trải nghiệm mua sắm
        trực tuyến thuận lợi và an toàn.
      </p>
      <p>
        Hãy khám phá các mẫu balo phong cách mới nhất của chúng tôi và không ngần ngại liên hệ nếu bạn có bất kỳ câu hỏi
        hoặc yêu cầu nào!
      </p>
      </div>
    </MainLayout>
  );
};

export default AboutPage;
