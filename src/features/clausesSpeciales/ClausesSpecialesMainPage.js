import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/style.css';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { Button, Input, Space, Table, Select, ConfigProvider } from 'antd';
import { EditOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getClausesSpeciales } from '../../api/clausesSpecialesApi';
import AddClauseSpecialeModal from './AddClauseSpecialeModal';
import UpdateClauseSpecialeModal from './UpdateClauseSpecialeModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';

import enUS from 'antd/lib/locale/en_US';



function ClausesSpecialesMainPage() {


    const [isAddClauseSpecialeModalVisible, setIsAddClauseSpecialeModalVisible] = useState(false);
    const [isUpdateClauseSpecialeModalVisible, setIsUpdateClauseSpecialeModalVisible] = useState(false);
    const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
    const [selectedClauseSpeciale, setSelectedClauseSpeciale] = useState(null);

    const [globalSearchText, setGlobalSearchText] = useState('');

    const queryClient = useQueryClient();

    const { isLoading, isError, data: clausesSpeciales } = useQuery('clausesSpeciales', getClausesSpeciales);

    const columnsClausesSpeciales = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Libelle',
            dataIndex: 'libelle',
            key: 'libelle',
            render: (text) => renderHighlightedColumn(text),

        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        style={{
                            backgroundColor: '#80BFB4',
                            borderColor: '#80BFB4',
                            color: 'white',
                            cursor: 'pointer',
                        }}
                        onClick={() => handleUpdateClauseSpeciale(record)}          >
                        <EditOutlined /> Modifier
                    </Button>
                    <Button
                        style={{
                            backgroundColor: '#36594C',
                            borderColor: '#36594C',
                            color: 'white',
                            cursor: 'pointer',
                        }}
                        onClick={() => handleDeleteClauseSpeciale(record)}
                    >
                        <DeleteOutlined /> Supprimer
                    </Button>
                </Space>



            ),
        },
    ];


    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error fetching data</div>;
    }




    //GLOBAL SEARCH


    const filteredClausesSpeciales = globalSearchText
        ? clausesSpeciales.filter((clauseSpeciale) =>
            Object.values(clauseSpeciale).some((value) =>
                value.toString().toLowerCase().includes(globalSearchText.toLowerCase())
            )
        )
        : clausesSpeciales;

    const handleGlobalSearch = (e) => {
        setGlobalSearchText(e.target.value);
    };


    const renderHighlightedColumn = (text) => {
        if (globalSearchText) {
            return (
                <Highlighter
                    highlightStyle={{ backgroundColor: 'rgba(2, 166, 118, 0.6)', color: 'white', padding: 0 }}
                    searchWords={[globalSearchText]}
                    autoEscape
                    textToHighlight={text.toString()}
                />
            );
        }
        return text;
    };
    //END GLOBAL SEARCH



    //MODAL RELATED FUNCTIONS

    const handleShowAddModal = () => {
        setIsAddClauseSpecialeModalVisible(true);
    };

    const handleCloseAddClauseSpecialeModal = () => {
        setIsAddClauseSpecialeModalVisible(false);
        queryClient.invalidateQueries('codeClausesSpeciales');

    };

    const handleShowUpdateClauseSpecialeModal = () => {
        setIsUpdateClauseSpecialeModalVisible(true);
    };

    const handleCloseUpdateClauseSpecialeModal = () => {
        setIsUpdateClauseSpecialeModalVisible(false);
        queryClient.invalidateQueries('codeClausesSpeciales');

    };

    const handleUpdateClauseSpeciale = (record) => {
        console.log("record:", record);
        setSelectedClauseSpeciale(record);
        console.log("selected", selectedClauseSpeciale)
        handleShowUpdateClauseSpecialeModal();
    };

    const handleShowDeleteConfirmationModal = () => {
        setIsConfirmationModalVisible(true);
    };

    const handleCloseDeleteConfirmationModal = () => {
        setIsConfirmationModalVisible(false);

    };

    const handleDeleteClauseSpeciale = (record) => {
        setSelectedClauseSpeciale(record);
        console.log("acte deletion", selectedClauseSpeciale)
        handleShowDeleteConfirmationModal();
    };


    //END MODAL RELATED FUNCTIONS


    return (

        <div style={{ padding: '20px 130px' }}  >
            <h1>CLAUSES SPECIALES</h1>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>


                <Button style={{ backgroundColor: '#588C7E', color: 'white' }}
                    onClick={handleShowAddModal}>
                    <PlusCircleOutlined /> Ajouter une clause spéciale
                </Button>
                <Input
                    placeholder="Recherche"
                    onChange={handleGlobalSearch}
                    prefix={<SearchOutlined />}
                    style={{ marginLeft: 10 }}
                />
            </div>
            <div>
                <ConfigProvider locale={enUS}>
                    <Table
                        dataSource={filteredClausesSpeciales}
                        columns={columnsClausesSpeciales}
                        rowKey="id"
                        locale={{
                            emptyText: 'AUCUNE DONNEE',
                        }}
                    />
                </ConfigProvider>
            </div>

            <AddClauseSpecialeModal
                isVisible={isAddClauseSpecialeModalVisible}
                onClose={handleCloseAddClauseSpecialeModal}
                onCancel={handleCloseAddClauseSpecialeModal}
            ></AddClauseSpecialeModal>

            <UpdateClauseSpecialeModal
                isVisible={isUpdateClauseSpecialeModalVisible}
                onClose={handleCloseUpdateClauseSpecialeModal}
                onCancel={handleCloseUpdateClauseSpecialeModal}
                initialData={selectedClauseSpeciale}

            ></UpdateClauseSpecialeModal>
            <DeleteConfirmationModal
                isVisible={isConfirmationModalVisible}
                onClose={handleCloseDeleteConfirmationModal}
                onCancel={handleCloseDeleteConfirmationModal}
                clause={selectedClauseSpeciale}
            ></DeleteConfirmationModal>
          
            <ToastContainer></ToastContainer>
        </div>

    );
};


export default ClausesSpecialesMainPage


