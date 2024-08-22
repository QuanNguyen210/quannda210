import React, { Fragment } from 'react';
import Header from '../Header';
import Footer from '../Footer';
import './blog.scss';
import { RightOutlined } from '@ant-design/icons';
import MainLayout from '../MainLayout';

const BlogPage = () => {
  // Danh sách bài viết mẫu
  const blogPosts = [
    {
      id: 1,
      title: '10 Mẫu Balo Thời Trang Hot Nhất Năm Này',
      content: 'Nội dung của bài viết về các mẫu balo thời trang nổi bật trong năm.',
      image: 'https://i.imgur.com/SUPqSzR.jpg',
    },
    {
      id: 2,
      title: 'Cách Chọn Balo Phù Hợp Với Phong Cách Cá Nhân',
      content: 'Một số gợi ý và lời khuyên để chọn balo phù hợp với phong cách của bạn.',
      image: 'https://i.imgur.com/I2MddTG.jpg',
    },
    {
      id: 3,
      title: 'Cách Chọn Balo Phù Hợp Với Phong Cách Cá Nhân',
      content: 'Một số gợi ý và lời khuyên để chọn balo phù hợp với phong cách của bạn.',
      image: 'https://i.imgur.com/hqYOxox.jpg',
    },
  ];
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

  const steps = ['Trang chủ', 'Blog'];

  return (
    <MainLayout>
      <div className="blog-container">
        <Breadcrumb steps={steps} />

        <div className="blog-posts">
          {blogPosts.map((post) => (
            <div key={post.id} className="blog-post">
              <img src={post.image} alt={post.title} className="blog-image" />
              <div className="blog-content">
                <h2>{post.title}</h2>
                <p>{post.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default BlogPage;
