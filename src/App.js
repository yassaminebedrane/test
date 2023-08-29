import './App.css';
import MedicamentList from './features/medicaments/MedicamentsMainPage.js';
import BaremesMainPage from './features/baremes/BaremesMainPage';
import ActesMainPage from './features/actes&sousActes/ActesMainPage';
import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import {
  MedicineBoxOutlined,
  FileOutlined,
  PlayCircleOutlined,
  HeartOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PathologiesMainPage from './features/pathologies&maladies/PathologiesMainPage';
import Logo from './css/téléchargement.png'

import Test from './features/test';

const { Sider } = Layout;
const { Content } = Layout;

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Sider
      width={200}
      theme="light"
      collapsible
      collapsed={collapsed}
      onCollapse={toggleSidebar}
    >
      <div className={`logo ${collapsed ? 'collapsed' : 'expanded'}`}>
        <img src={Logo} alt="Company Logo" />
      </div>
      {/* <button onClick={toggleSidebar}>III</button> */}

      <Menu mode="vertical" defaultSelectedKeys={['1']}>
        <Menu.Item key="1" icon={<MedicineBoxOutlined />}>
          <Link to="/medicaments">Medicaments</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<FileOutlined />}>
          <Link to="/baremes">Baremes</Link>
        </Menu.Item>
        <Menu.Item key="3" icon={<PlayCircleOutlined />}>
          <Link to="/actes">Actes</Link>
        </Menu.Item>
        <Menu.Item key="4" icon={<HeartOutlined />}>
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
              <Route path="/" element={<MedicamentList />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
    // <Test></Test>
  );
}

export default App;
