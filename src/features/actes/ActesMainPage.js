import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/style.css';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { Button, Input, Space, Table, Select } from 'antd';
import { EditOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getBaremes, searchBaremesByType, getCodeActes, getCodeSousActes, getCodeTypePrestataires, getNatures, filterBaremes, updateBareme } from '../../api/baremesApi';
// import AddBaremeModal from './AddBaremeModal';
// import UpdateBaremeModal from './UpdateBaremeModal';
// import DeleteConfirmationModal from './DeleteConfirmationModal';




function ActesMainPage() {
    const { isLoading, isError, data: codeActes } = useQuery('codeActes', getCodeActes);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Libelle',
            dataIndex: 'libelle',
            key: 'libelle',
        },
    ];

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error fetching data</div>;
    }

    return (
       
        <div style={{ padding: '20px 130px' }}  >
        <h1>CODES ACTES</h1>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>


            <Button style={{ backgroundColor: '#588C7E', color: 'white' }}>
                <PlusCircleOutlined /> Ajouter un code acte
            </Button>
            <Input
                placeholder="Recherche"
                prefix={<SearchOutlined />}
                style={{ marginLeft: 10 }}
            />
        </div>
        <div>
        <Table
            dataSource={codeActes}
            columns={columns}
            expandable={{
                expandedRowRender: (record) => <p style={{ margin: 0 }}>{record.libelle}</p>,
                rowExpandable: (record) => record.libelle !== 'Not Expandable',
              }}
            rowKey="id"
            pagination={{ pageSize: 10 }}
        />
        </div>
        </div>
        
    );
};


export default ActesMainPage