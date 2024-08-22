import React from 'react';
import './Footer.scss';
import { FaFacebookSquare, FaInstagram, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer" style={{ marginTop: '50px' }}>
      <div className="footer-content">
        <div className="footer-column">
          <h4>Thông tin</h4>
          <ul>
            <li>Về chúng tôi</li>
            <li>Liên hệ: 0355632094</li>
            <li>FAQs</li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>Danh mục</h4>
          <ul>
            <li>Sản phẩm</li>
            <li>Khuyến mãi</li>
            <li>Tin tức</li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>Theo dõi chúng tôi</h4>
          <div className="social-icons">
            <a style={{ fontSize: '30px' }} href="https://www.facebook.com">
              <FaFacebookSquare />
            </a>
            <a style={{ fontSize: '30px', margin: '0 20px' }} href="https://www.instagram.com">
              <FaInstagram />
            </a>
            <a style={{ fontSize: '30px' }} href="https://www.twitter.com">
              <FaTwitter />
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Web bán hàng. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
