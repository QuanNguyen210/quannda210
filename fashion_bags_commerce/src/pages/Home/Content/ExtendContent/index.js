import { Fragment } from 'react';

import styles from './index.module.scss';
import { Image } from 'antd';

function ExtendContent({ titleContent }) {
  return (
    <Fragment>
      <div className={styles.block}>
        <div className={styles.titleBlock}>
          <span>{titleContent}</span>
          <a className={styles.viewAll}>Xem tất cả</a>
        </div>
        <div className={styles.productList}>
          <div className={styles.container}>
            <div className="row">
              <div className="col-4">
                <div className={styles.producItem}>
                  <div className={styles.productImage}>
                    <a>
                      <div className={styles.contentImage}>
                        <Image src="https://i.imgur.com/7TWGiF7.jpg"></Image>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-4">
                <div className={styles.producItem}>
                  <div className={styles.productImage}>
                    <a>
                      <div className={styles.contentImage}>
                        <Image src="https://i.imgur.com/aJzSBoW.jpg"></Image>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-4">
                <div className={styles.producItem}>
                  <div className={styles.productImage}>
                    <a>
                      <div className={styles.contentImage}>
                        <Image src="https://i.imgur.com/7TWGiF7.jpg"></Image>
                      </div>
                    </a>
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

export default ExtendContent;
