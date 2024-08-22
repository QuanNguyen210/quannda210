import { Fragment } from 'react';

import styles from './index.module.scss';
import { Image } from 'antd';

function ProductList({ titleContent }) {
  return (
    <Fragment>
      <div className={styles.block}>
        <div className={styles.container1}>
          <div>
            <div>
              <div className={styles.titleBlock}>
                <span>{titleContent}</span>
                <a className={styles.viewAll}>Xem tất cả</a>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.productList}>
          <div className={styles.container1}>
            <div className="row">
              <div className="col-3">
                <div className={styles.producItem}>
                  <div className={styles.productImage}>
                    <a>
                      <div className={styles.contentImage}>
                        <Image src="
                        https://firebasestorage.googleapis.com/v0/b/bagsgirl-datn.appspot.com/o/mulitpleFiles%2Fimage28946_11_21_2023_0%3A49%3A38%3A958?alt=media&token=52ccf64c-669e-478b-b999-7c7c1b47a347
                        "></Image>
                      </div>
                    </a>
                  </div>
                  <div className={styles.describer}>
                    <span className={styles.productPrice}>
                      <ins>
                        <span className={styles.productTitle}>900000</span>
                        <span>đ</span>
                      </ins>
                    </span>
                    <div className={styles.productTitle}>Balo thời trang đi học</div>
                  </div>
                </div>
              </div>
              <div className="col-3">
                <div className={styles.producItem}>
                  <div className={styles.productImage}>
                    <a>
                      <div className={styles.contentImage}>
                        <Image src="https://www.vascara.com/uploads/cms_productmedia/2023/August/31/tui-tote-over-size-quai-doi-that-nut---tot-0129---mau-den__71544__1693428905-medium.jpg"></Image>
                      </div>
                    </a>
                  </div>
                  <div className={styles.describer}>
                    <span className={styles.productPrice}>
                      <ins>
                        <span className={styles.amount}>938000</span>
                        <span>đ</span>
                      </ins>
                    </span>
                    <div className={styles.productTitle}>Balo thời trang đi làm</div>
                  </div>
                </div>
              </div>
              <div className="col-3">
                <div className={styles.producItem}>
                  <div className={styles.productImage}>
                    <a>
                      <div className={styles.contentImage}>
                        <Image src="https://www.vascara.com/uploads/cms_productmedia/2023/August/31/giay-slingback-nhan-quai-ankle-strap---bmn-0600---mau-do__71387__1693424341-medium.jpg"></Image>
                      </div>
                    </a>
                  </div>
                  <div className={styles.describer}>
                    <span className={styles.productPrice}>
                      <ins>
                        <span className={styles.amount}>500000</span>
                        <span>đ</span>
                      </ins>
                    </span>
                    <div className={styles.productTitle}>Balo du lịch</div>
                  </div>
                </div>
              </div>

              <div className="col-3">
                <div className={styles.producItem}>
                  <div className={styles.productImage}>
                    <a>
                      <div className={styles.contentImage}>
                        <Image src="https://firebasestorage.googleapis.com/v0/b/bagsgirl-datn.appspot.com/o/mulitpleFiles%2Fimage46644_11_21_2023_0%3A20%3A13%3A565?alt=media&token=df100f1c-c8e7-4196-ab77-4b34bd7a939d"></Image>
                      </div>
                    </a>
                  </div>
                  <div className={styles.describer}>
                    <span className={styles.productPrice}>
                      <ins>
                        <span className={styles.amount}>400000</span>
                        <span>đ</span>
                      </ins>
                    </span>
                    <div className={styles.productTitle}>Balo khoác tay</div>
                  </div>
                </div>
              </div>
            </div>
            <br></br>
            <br></br>
            <br></br>

            <div className="row">
              <div className="col-3">
                <div className={styles.producItem}>
                  <div className={styles.productImage}>
                    <a>
                      <div className={styles.contentImage}>
                        <Image src="https://www.vascara.com/uploads/cms_productmedia/2023/August/31/giay-slingback-nhan-quai-ankle-strap---bmn-0600---mau-do__71387__1693424341-medium.jpg"></Image>
                      </div>
                    </a>
                  </div>
                  <div className={styles.describer}>
                    <span className={styles.productPrice}>
                      <ins>
                        <span className={styles.amount}>3400000</span>
                        <span>đ</span>
                      </ins>
                    </span>
                    <div className={styles.productTitle}>Balo đi chợ</div>
                  </div>
                </div>
              </div>
              <div className="col-3">
                <div className={styles.producItem}>
                  <div className={styles.productImage}>
                    <a>
                      <div className={styles.contentImage}>
                        <Image src="https://www.vascara.com/uploads/cms_productmedia/2023/August/31/tui-deo-cheo-may-chan-hinh-vuong---sho-0213---mau-kem__71508__1693427949-medium.jpg"></Image>
                      </div>
                    </a>
                  </div>
                  <div className={styles.describer}>
                    <span className={styles.productPrice}>
                      <ins>
                        <span className={styles.amount}>540000</span>
                        <span>đ</span>
                      </ins>
                    </span>
                    <div className={styles.productTitle}>Balo Anh quốc</div>
                  </div>
                </div>
              </div>
              <div className="col-3">
                <div className={styles.producItem}>
                  <div className={styles.productImage}>
                    <a>
                      <div className={styles.contentImage}>
                        <Image src="https://www.vascara.com/uploads/cms_productmedia/2023/August/31/tui-tote-over-size-quai-doi-that-nut---tot-0129---mau-den__71544__1693428905-medium.jpg"></Image>
                      </div>
                    </a>
                  </div>
                  <div className={styles.describer}>
                    <span className={styles.productPrice}>
                      <ins>
                        <span className={styles.amount}>360000</span>
                        <span>đ</span>
                      </ins>
                    </span>
                    <div className={styles.productTitle}>Balo thời trang đeo chéo</div>
                  </div>
                </div>
              </div>
              <div className="col-3">
                <div className={styles.producItem}>
                  <div className={styles.productImage}>
                    <a>
                      <div className={styles.contentImage}>
                        <Image src="https://www.vascara.com/uploads/cms_productmedia/2023/August/31/tui-deo-cheo-may-chan-hinh-vuong---sho-0213---mau-kem__71508__1693427949-medium.jpg"></Image>
                      </div>
                    </a>
                  </div>
                  <div className={styles.describer}>
                    <span className={styles.productPrice}>
                      <ins>
                        <span className={styles.amount}>890000</span>
                        <span>đ</span>
                      </ins>
                    </span>
                    <div className={styles.productTitle}>Balo sinh viên</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default ProductList;
