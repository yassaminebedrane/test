import React, { useState } from 'react';
import axios from 'axios';
import '../../css/style.css';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { Button, Input, Space, Table } from 'antd';
import { EditOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getMedicaments, addMedicament, updateMedicament, deleteMedicament } from '../../api/medicamentsApi';
import AddMedicamentModal from './AddMedicamentModal';
import UpdateMedicamentModal from './UpdateMedicamentModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




const MedicamentList = () => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const [sortColumn, setSortColumn] = useState('');
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [selectedMedicament, setSelectedMedicament] = useState(null);
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
    const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [globalSearchText, setGlobalSearchText] = useState('');
    const searchInput = React.useRef(null);
    const queryClient = useQueryClient();

    const {
        isLoading,
        isError,
        error,
        data: medicaments
    } = useQuery('medicaments', async () => {
        try {
            const response = await axios.get('http://localhost:3500/medicaments');
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch data');
        }
    });
            
    const addMedicamentMutation = useMutation(addMedicament, {
        onSuccess: () => {
            queryClient.invalidateQueries('medicaments');
        }
    });

    const updateMedicamentMutation = useMutation(updateMedicament, {
        onSuccess: () => {
            queryClient.invalidateQueries('medicaments');
        }
    });

    const deleteMedicamentMutation = useMutation(deleteMedicament, {
        onSuccess: () => {
            queryClient.invalidateQueries('medicaments');
        }
    });

    const showToastMessage = () => {
        toast.success('Success Notification !', {
            position: toast.POSITION.TOP_CENTER
        });
    };

    const handleEdit = (record) => {
        setSelectedMedicament(record);
        handleShowUpdateModal();
    };


    const handleDelete = (record) => {
        setSelectedMedicament(record);
        handleShowDeleteConfirmationModal();
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text.toString()}
                />
            ) : (
                text
            ),
    });

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const handleTableChange = (pagination, filters, sorter) => {
        console.log(sorter.order, sorter.field);
        setSortOrder(sorter.order);
        setSortColumn(sorter.field);
    };


    const filteredMedicaments = globalSearchText
        ? medicaments.filter((medicament) =>
            Object.values(medicament).some((value) =>
                value.toString().toLowerCase().includes(globalSearchText.toLowerCase())
            )
        )
        : [];

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

    const handleReactivate = async (record) => {
        const updatedMedicament = { ...record, etat: true };
        try {
            await updateMedicamentMutation.mutateAsync(updatedMedicament);
            console.log('Medicament réactivé avec succès');
        } catch (error) {
            console.error('Error reactivating medicament:', error);
        }
    };
    



    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: '5%',
        },
        {
            title: 'Nom',
            dataIndex: 'nom',
            key: 'nom',
            ...getColumnSearchProps('nom'),
            sorter: (a, b) => a.nom.localeCompare(b.nom),
            sortOrder: sortColumn === 'nom' ? sortOrder : null,
            sortDirections: ['ascend', 'descend'],
            render: (text) => renderHighlightedColumn(text),

        },
        {
            title: 'Prix Hospitalier',
            dataIndex: 'prix_hospitalier',
            key: 'prix_hospitalier',
            ...getColumnSearchProps('prix_hospitalier'),
            sorter: (a, b) => a.prix_hospitalier - b.prix_hospitalier,
            sortOrder: sortColumn === 'prix_hospitalier' ? sortOrder : null,
            sortDirections: ['ascend', 'descend'],
            render: (text) => renderHighlightedColumn(text),


        },
        {
            title: 'Tarif',
            dataIndex: 'tarif',
            key: 'tarif',
            ...getColumnSearchProps('tarif'),
            sorter: (a, b) => a.tarif - b.tarif,
            sortOrder: sortColumn === 'tarif' ? sortOrder : null,
            sortDirections: ['ascend', 'descend'],
            render: (text) => renderHighlightedColumn(text),

        },
        {
            title: 'Dénomination',
            dataIndex: 'denomination',
            key: 'denomination',
            ...getColumnSearchProps('denomination'),
            sorter: (a, b) => a.denomination.localeCompare(b.denomination),
            sortOrder: sortColumn === 'denomination' ? sortOrder : null,
            sortDirections: ['ascend', 'descend'],
            render: (text) => renderHighlightedColumn(text),


        },
        {
            title: 'Prix Public',
            dataIndex: 'prix_public',
            key: 'prix_public',
            ...getColumnSearchProps('prix_public'),
            sorter: (a, b) => a.prix_public - b.prix_public,
            sortOrder: sortColumn === 'prix_public' ? sortOrder : null,
            sortDirections: ['ascend', 'descend'],
            render: (text) => renderHighlightedColumn(text),


        },
        {
            title: 'Nombre de boîtes',
            dataIndex: 'nombre_de_boites',
            key: 'nombre_de_boites',
            ...getColumnSearchProps('nombre_de_boites'),
            sorter: (a, b) => a.nombre_de_boites - b.nombre_de_boites,
            sortOrder: sortColumn === 'nombre_de_boites' ? sortOrder : null,
            sortDirections: ['ascend', 'descend'],
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
                            backgroundColor: record.etat ? '#80BFB4' : 'lightgray',
                            borderColor: record.etat ? '#80BFB4' : 'lightgray',
                            color: record.etat ? 'white' : 'darkgray',
                            cursor: record.etat ? 'pointer' : 'not-allowed',
                        }}
                        onClick={() => handleEdit(record)}
                        disabled={!record.etat}
                    >
                        <EditOutlined /> Modifier
                    </Button>
                    <Button
                        style={{
                            backgroundColor: record.etat ? '#36594C' : 'lightgray',
                            borderColor: record.etat ? '#36594C' : 'lightgray',
                            color: record.etat ? 'white' : 'darkgray',
                            cursor: record.etat ? 'pointer' : 'not-allowed',
                        }}
                        onClick={() => handleDelete(record)}
                        disabled={!record.etat}
                    >
                        <DeleteOutlined /> Supprimer
                    </Button>
                    {!record.etat && (
                        <Button
                            style={{
                                backgroundColor: 'rgba(2, 166, 118, 0.6)',
                                borderColor: 'rgba(2, 166, 118, 0.6)',
                                color: 'white',
                                cursor: 'pointer',
                            }}
                            onClick={() => handleReactivate(record)}
                        >
                            Réactiver
                        </Button>
                    )}

                </Space>



            ),
        },
    ];





    const handleShowAddModal = () => {
        setIsAddModalVisible(true);
    };

    const handleCloseAddModal = () => {
        setIsAddModalVisible(false);

    };


    const handleShowUpdateModal = () => {
        setIsUpdateModalVisible(true);
    };

    const handleCloseUpdateModal = () => {
        setIsUpdateModalVisible(false);

    };

    const handleShowDeleteConfirmationModal = () => {
        setIsConfirmationModalVisible(true);
    };

    const handleCloseDeleteConfirmationModal = () => {
        setIsConfirmationModalVisible(false);

    };




    return (
        <div style={{ padding: '20px 130px' }}  >
            <h1>MEDICAMENTS</h1>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>


                <Button style={{ backgroundColor: '#588C7E', color: 'white' }} onClick={handleShowAddModal}>
                    <PlusCircleOutlined /> Ajouter un médicament
                </Button>
                <Input
                    placeholder="Recherche"
                    value={globalSearchText}
                    onChange={handleGlobalSearch}
                    prefix={<SearchOutlined />}
                    style={{ marginLeft: 10 }}
                />
            </div>
            <div>
                <Table
                    bordered
                    rowClassName={() => "rowClassName1"}
                    dataSource={filteredMedicaments}
                    columns={columns}
                    loading={isLoading}
                    rowKey="id"
                    onChange={handleTableChange}

                // pagination={{
                //     pageSize: itemsPerPage,
                //   }}

                />
            </div>

            <AddMedicamentModal
                isVisible={isAddModalVisible}
                onClose={handleCloseAddModal}
                onCancel={handleCloseAddModal}
                onSubmit={(formData) => {
                    console.log('Add Medicament:', formData);
                }}
            />
            <UpdateMedicamentModal
                isVisible={isUpdateModalVisible}
                onClose={handleCloseUpdateModal}
                onCancel={handleCloseUpdateModal}
                onSubmit={(formData) => {
                    console.log('Update Medicament:', formData);
                }}
                initialData={selectedMedicament}
            />
            <DeleteConfirmationModal
                isVisible={isConfirmationModalVisible}
                onClose={handleCloseDeleteConfirmationModal}
                onCancel={handleCloseDeleteConfirmationModal}
                medicament={selectedMedicament}
            ></DeleteConfirmationModal>
            <ToastContainer />
            {/* <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
                <option value={10}>10 items</option>
                <option value={20}>20 items</option>
                <option value={50}>50 items</option>
            </select> */}

        </div>
    );
};

export default MedicamentList;
