import './App.css';
import MedicamentList from './features/medicaments/MedicamentsMainPage.js';
import BaremesMainPage from './features/baremes/BaremesMainPage';
import ActesMainPage from './features/actes&sousActes/ActesMainPage'
import React from 'react';
import { Layout, Menu } from 'antd';
import {
  MedicineBoxOutlined,
  ProfileOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom'; 
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PathologiesMainPage from './features/pathologies&maladies/PathologiesMainPage';


const { Sider } = Layout;
const { Content } = Layout;

function Sidebar() {
  return (
    <Sider width={200} theme="light">
      <Menu mode="vertical" defaultSelectedKeys={['1']}>
        <Menu.Item key="1" icon={<MedicineBoxOutlined />}>
          <Link to="/medicaments">Medicaments</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<ProfileOutlined />}>
          <Link to="/baremes">Baremes</Link>
        </Menu.Item>
        <Menu.Item key="3" icon={<PlayCircleOutlined />}>
          <Link to="/actes">Actes</Link>
        </Menu.Item>
        <Menu.Item key="4" icon={<PlayCircleOutlined />}>
          <Link to="/pathologies">Pathologies</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
}



function App() {
  
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Sidebar />
        <Layout>
          <Content style={{ padding: '24px' }}>
            <Routes>
              <Route path="/medicaments" element={<MedicamentList />} />
              <Route path="/baremes" element={<BaremesMainPage />} />
              <Route path="/actes" element={<ActesMainPage />} />
              <Route path="/pathologies" element={<PathologiesMainPage />} />
              <Route path="/" element={<ActesMainPage />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
}

export default App;


