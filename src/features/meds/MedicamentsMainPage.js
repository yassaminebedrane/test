import React, { useState } from 'react';
import '../../index.css';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { Button, Input, Space, Table } from 'antd';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getMedicaments, addMedicament, updateMedicament, deleteMedicament } from '../../api/medicamentsApi';
import MedicamentModal from './MedicamentModal';
import UpdateMedicamentModal from './UpdateMedicamentModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const MedicamentList = () => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [selectedMedicament, setSelectedMedicament] = useState(null);
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
    const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
    const searchInput = React.useRef(null);
    const queryClient = useQueryClient();

    const {
        isLoading,
        isError,
        error,
        data: medicaments
    } = useQuery('medicaments', getMedicaments);

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
        },
        {
            title: 'Prix Hospitalier',
            dataIndex: 'prix_hospitalier',
            key: 'prix_hospitalier',
            ...getColumnSearchProps('prix_hospitalier'),
        },
        {
            title: 'Tarif',
            dataIndex: 'tarif',
            key: 'tarif',
            ...getColumnSearchProps('tarif'),
        },
        {
            title: 'Denomination',
            dataIndex: 'denomination',
            key: 'denomination',
            ...getColumnSearchProps('denomination'),
        },
        {
            title: 'Prix Public',
            dataIndex: 'prix_public',
            key: 'prix_public',
            ...getColumnSearchProps('prix_public'),
        },
        {
            title: 'Nombre de Boites',
            dataIndex: 'nombre_de_boites',
            key: 'nombre_de_boites',
            ...getColumnSearchProps('nombre_de_boites'),
        },
        {
            title: 'Etat',
            dataIndex: 'etat',
            key: 'etat',
            render: (etat) => <span>{etat ? 'Active' : 'Inactive'}</span>,
            ...getColumnSearchProps('etat'),
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="small">
                    <Button onClick={() => handleEdit(record)}>
                        Modifier
                    </Button>
                    <Button onClick={() => handleDelete(record)}>
                        Supprimer
                    </Button>
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
        <div style={{ padding: '5px 70px' }}>
            <h1>Médicaments</h1>
            <Button type="primary" onClick={handleShowAddModal}>
                Ajouter un médicament
            </Button>
            <div style={{ padding: '25px' }}>
                <Table
                    dataSource={medicaments}
                    columns={columns}
                    loading={isLoading}
                    rowKey="id"
                />
            </div>

            <MedicamentModal
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

        </div>
    );
};

export default MedicamentList;
