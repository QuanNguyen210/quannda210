import { Button, Carousel } from 'antd';
import { Fragment, useState, useRef } from 'react';

import styles from './index.module.scss';

function LayoutCarousel() {
  return (
    <Fragment>
      <div className={styles.banner}>
        <Carousel autoplay={true} autoplaySpeed={2000} draggable={true}>
          <div>
            <img
              src="https://i.imgur.com/gbFfVVc.jpg"
              alt="TEACHER'S DAY 2023"
              // className="d-block w-100"
            />
          </div>
          <div>
            <img
              src="https://i.imgur.com/rtHttD2.png"
              alt="TEACHER'S DAY 2023"
              // className="d-block w-100"
            />
          </div>
          <div className="carousel_item">
            <img
              alt="TEACHER'S DAY"
              // className="d-block w-100"
              src="https://i.imgur.com/D6SaqWh.jpg"
            ></img>
          </div>
          <div className="carousel_item">
            <img
              alt="NEW ARRIVAL - T10"
              // className="d-block w-100"
              src="https://i.imgur.com/eLX3rvG.jpg"
            ></img>
          </div>
        </Carousel>
      </div>

      {/* <div className={styles.block}>
        <div className="container">
          <div className="row">
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12 item-banner">
              <a href="#" aria-label="Bộ sưu tập vascara">
                <img
                  className={styles.imgContent}
                  src="https://www.vascara.com/uploads/cms_productmedia/2023/August/31/giay-slingback-nhan-quai-ankle-strap---bmn-0600---mau-do__71387__1693424341-medium.jpg"
                  data-src=""
                  alt="Bộ sưu tập vascara"
                />
              </a>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12 item-banner">
              <a href="#" aria-label="Bộ sưu tập vascara">
                <img
                  className={styles.imgContent}
                  src="https://www.vascara.com/uploads/cms_productmedia/2023/August/31/giay-slingback-nhan-quai-ankle-strap---bmn-0600---mau-do__71387__1693424341-medium.jpg"
                  data-src=""
                  alt="Bộ sưu tập vascara"
                />
              </a>
            </div>
          </div>
        </div>
      </div> */}
    </Fragment>
  );
}

export default LayoutCarousel;
