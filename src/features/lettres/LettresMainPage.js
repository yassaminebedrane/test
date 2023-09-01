import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import '../../css/style.css';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { Button, Input, Space, Table, Select, ConfigProvider } from 'antd';
import { EditOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getLettres, getTypesCorrespondances, filterLettres } from '../../api/lettresApi';
import AddLettreModal from './AddLettreModal';
import UpdateLettreModal from './UpdateLettreModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';

import enUS from 'antd/lib/locale/en_US';
import { keyboard } from '@testing-library/user-event/dist/keyboard';



function LettresMainPage() {


    const [isAddLettreModalVisible, setIsAddLettreModalVisible] = useState(false);
    const [isUpdateLettreModalVisible, setIsUpdateLettreModalVisible] = useState(false);
    const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
    const [selectedLettre, setSelectedLettre] = useState(null);
    const [selectedTypeLettre, setSelectedTypeLettre] = useState(null)
    const [globalSearchText, setGlobalSearchText] = useState('');

    const queryClient = useQueryClient();

    const { isLoading, isError, data: lettres } = useQuery('lettres', getLettres);
    const { data: typesCorrespondances } = useQuery('type_correspondance', getTypesCorrespondances);

    const { Option } = Select;



    const { data: filteredData } = useQuery(
        ['filteredLettres', selectedTypeLettre],
        () => filterLettres(selectedTypeLettre),
        {
            // enabled: selectedTypeLettre !== null,
            refetchOnWindowFocus: false,
        }
    );


    const columnsLettres = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Texte',
            dataIndex: 'texte',
            key: 'texte',
            render: (texte) => renderHighlightedColumn(texte),

        },
        {
            title: 'Type correspondance',
            dataIndex: 'type_correspondance_id',
            key: 'type_correspondance',
            render: (typeCorrespondanceId) => {
                const TypeCorrespondance = typesCorrespondances ? typesCorrespondances.find(type => type.id === typeCorrespondanceId) : [];
                return renderHighlightedColumn(TypeCorrespondance ? TypeCorrespondance.libelle : '-');
            },
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
                        onClick={() => handleUpdateLettre(record)}          >
                        <EditOutlined /> Modifier
                    </Button>
                    <Button
                        style={{
                            backgroundColor: '#36594C',
                            borderColor: '#36594C',
                            color: 'white',
                            cursor: 'pointer',
                        }}
                        onClick={() => handleDeleteLettre(record)}
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
    const filteredLettres = filteredData

        ? filteredData.filter((lettre) => {
            console.log(filteredData)
            let matchesSearch = false;
            for (const [key, value] of Object.entries(lettre)) {
                let searchableValue = value;

                if (key === "type_correspondance_id") {
                    const typeCorrespondance = typesCorrespondances.find((type) => type.id === value);
                    if (typeCorrespondance) {
                        searchableValue = `${typeCorrespondance.libelle}`;
                    } else {
                        searchableValue = '';
                    }
                }

                if (
                    searchableValue
                        .toString()
                        .toLowerCase()
                        .includes(globalSearchText.toLowerCase())
                ) {
                    matchesSearch = true;
                    break;
                }
            }

            return matchesSearch;
        })
        : filteredData;




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
        setIsAddLettreModalVisible(true);
    };

    const handleCloseAddLettreModal = () => {
        setIsAddLettreModalVisible(false);
        queryClient.invalidateQueries('lettres');

    };

    const handleShowUpdateLettreModal = () => {
        setIsUpdateLettreModalVisible(true);
    };

    const handleCloseUpdateLettreModal = () => {
        setIsUpdateLettreModalVisible(false);
        queryClient.invalidateQueries('lettres');

    };

    const handleUpdateLettre = (record) => {
        setSelectedLettre(record);
        handleShowUpdateLettreModal();
    };

    const handleShowDeleteConfirmationModal = () => {
        setIsConfirmationModalVisible(true);
    };

    const handleCloseDeleteConfirmationModal = () => {
        setIsConfirmationModalVisible(false);

    };

    const handleDeleteLettre = (record) => {
        setSelectedLettre(record);
        handleShowDeleteConfirmationModal();
    };

    //END MODAL RELATED FUNCTIONS

    const handleResetSelect = () => {
        setSelectedTypeLettre(null);
    }


    return (

        <div style={{ padding: '20px 130px' }}  >
            <h1>LETTRES</h1>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>


                <Button style={{ backgroundColor: '#588C7E', color: 'white' }}
                    onClick={handleShowAddModal}>
                    <PlusCircleOutlined /> Ajouter une lettre
                </Button>
                <Select style={{ width: 400, marginRight: '10px' }} placeholder="Type lettre"
                    value={selectedTypeLettre}
                    onChange={(value) => setSelectedTypeLettre(value)}
                >
                    {typesCorrespondances && typesCorrespondances.map((value) => (
                        <Option key={value.id} value={value.id}>
                            {value.libelle}
                        </Option>
                    ))}
                </Select>
                <Button style={{ backgroundColor: '#588C7E', color: 'white', marginRight: '10px' }}
                    onClick={handleResetSelect} >Reinitialiser</Button>
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
                        dataSource={filteredLettres}
                        columns={columnsLettres}
                        rowKey="id"
                        locale={{
                            emptyText: 'AUCUNE DONNEE',
                        }}
                    />
                </ConfigProvider>
            </div>

            <AddLettreModal
                isVisible={isAddLettreModalVisible}
                onClose={handleCloseAddLettreModal}
                onCancel={handleCloseAddLettreModal}
            ></AddLettreModal>
            <UpdateLettreModal
                isVisible={isUpdateLettreModalVisible}
                onClose={handleCloseUpdateLettreModal}
                onCancel={handleCloseUpdateLettreModal}
                initialData={selectedLettre}

            ></UpdateLettreModal>
            <DeleteConfirmationModal
                isVisible={isConfirmationModalVisible}
                onClose={handleCloseDeleteConfirmationModal}
                onCancel={handleCloseDeleteConfirmationModal}
                lettre={selectedLettre}
            ></DeleteConfirmationModal>


            <ToastContainer></ToastContainer>
        </div>

    );
};


export default LettresMainPage


