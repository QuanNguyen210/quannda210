import Sidebar from '~/component/GlobalStyles/layouts/DefaultLayout/SideBar';
import { Layout } from 'antd';
import HeaderContent from '~/component/GlobalStyles/layouts/DefaultLayout/Header';
import { useEffect } from 'react';
import TableHoaDonLoi from './TableHoaDonLoi/TableHoaDonLoi';

const { Header, Footer, Sider, Content } = Layout;

function HoaDonLoiView() {
    useEffect(() => {
        document.title = 'Hóa đơn lỗi';
    });
    return (
        <Layout style={{ height: '100%', background: '#f4f3f4' }}>
            <Sider width={260} style={{ background: '#fff', zIndex: '999', position: 'fixed', overflowY: 'auto' }}>
                <Sidebar keyIndex="sub3.2" openKey="sub3" />
            </Sider>
            <Layout className="layoutContent">
                <Header className="headerStyle">
                    <HeaderContent titlePage="Danh Sách Hóa Đơn" />
                </Header>
                <Content className="contentStyle">
                    <TableHoaDonLoi style={{ boder: 'black solid 1px' }} />
                </Content>
            </Layout>
        </Layout>
    );
}
export default HoaDonLoiView;
