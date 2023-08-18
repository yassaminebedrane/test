import React, { useState } from 'react';
import axios from 'axios';
import '../../css/style.css';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { Button, Input, Space, Table, Select } from 'antd';
import { EditOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getBaremes, searchBaremesByType, getCodeActes, getCodeSousActes, getCodeTypePrestataires, getNatures } from '../../api/baremesApi';
import AddBaremeModal from './AddBaremeModal';
import UpdateBaremeModal from './UpdateBaremeModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';


const BaremesMainPage = () => {

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const [sortColumn, setSortColumn] = useState('');

    const [selectedType, setSelectedType] = useState('');
    const [baremesData, setBaremesData] = useState([]);

    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    // const [selectedMedicament, setSelectedMedicament] = useState(null);
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
    const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
    // const [itemsPerPage, setItemsPerPage] = useState(10);

    const [selectedCodeActe, setSelectedCodeActe] = useState(null);
    const [selectedCodeSousActe, setSelectedCodeSousActe] = useState(null);
    const [codeSousActeOptions, setCodeSousActeOptions] = useState([]);


    const [globalSearchText, setGlobalSearchText] = useState('');

    const [selectedBareme, setSelectedBareme] = useState(null);

    const searchInput = React.useRef(null);
    const queryClient = useQueryClient();
    const { Option } = Select;

    const typeBareme = [
        'FMSAR', 'AMO', 'CNOPS', 'WAFA1',
        'HP0', 'CHU',
        'HP', 'CHUCNOPS', 'HPCNOPS',
        'SECTMUT',
    ];

    const { isLoading, isError, data: baremes } = useQuery('baremes', getBaremes);
    const { data: codeActes } = useQuery('codeActes', getCodeActes);
    const { data: codeSousActes } = useQuery('codeSousActes', getCodeSousActes);
    const { data: codeTypePrestataires } = useQuery('codeTypePrestataires', getCodeTypePrestataires);
    const { data: natures } = useQuery('natures', getNatures);





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


    const filteredBaremes = globalSearchText
        ? baremes.filter((bareme) =>
            Object.values(bareme).some((value) =>
                value.toString().toLowerCase().includes(globalSearchText.toLowerCase())
            )
        )
        : baremes;

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


    const handleTypeSelect = async (value) => {
        setSelectedType(value);
        if (value) {
            try {
                const data = await searchBaremesByType(value);
                setBaremesData(data);
            } catch (error) {
                console.error('Error fetching baremes:', error);
            }
        } else {
            setBaremesData([]);
        }
    };

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

    const handleDelete = (record) => {
        setSelectedBareme(record);
        handleShowDeleteConfirmationModal();
    };


    const handleEdit = (record) => {
        setSelectedBareme(record);
        handleShowUpdateModal();
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Code Acte',
            dataIndex: 'code_acte',
            key: 'code_acte',
            render: (codeActeId) => {
                const codeActe = codeActes.find(acte => acte.id === codeActeId);
                return codeActe ? codeActe.libelle : '-';
            },
        },
        {
            title: 'Code Sous Acte',
            dataIndex: 'code_sous_acte',
            key: 'code_sous_acte',
            render: (codeSousActeId) => {
                const codeSousActe = codeSousActes.find(acte => acte.id === codeSousActeId);
                return codeSousActe ? codeSousActe.libelle : '-';
            },
        },
        {
            title: 'Type Bareme',
            dataIndex: 'type_bareme',
            key: 'type_bareme',
        },
        {
            title: 'Type Tarif',
            dataIndex: 'type_tarif',
            key: 'type_tarif',
            render: (typeTarif) => (
              typeTarif === 'P' ? 'Forfaitaire' : (typeTarif === 'U' ? 'Unitaire' : 'Unknown')
            ),
          },
          
        {
            title: 'Type Lette',
            dataIndex: 'type_lette',
            key: 'type_lette',
        },
        {
            title: 'Montant',
            dataIndex: 'montant',
            key: 'montant',
        },
        {
            title: 'Taux Remboursement',
            dataIndex: 'taux_remboursement',
            key: 'taux_remboursement',
        },
        {
            title: 'Taux Remboursement Public',
            dataIndex: 'taux_remboursement_public',
            key: 'taux_remboursement_public',
        },
        {
            title: 'Plafond',
            dataIndex: 'plafond',
            key: 'plafond',
        },
        {
            title: 'Periode',
            dataIndex: 'periode',
            key: 'periode',
        },
        {
            title: 'Cotation',
            dataIndex: 'cotation',
            key: 'cotation',
        },
        {
            title: 'Code Type Prestataire',
            dataIndex: 'code_type_prestataire',
            key: 'code_type_prestataire',
            render: (codeTypePrestataireId) => {
                const codeTypePrestataire = codeTypePrestataires.find(acte => acte.id === codeTypePrestataireId);
                return codeTypePrestataire ? codeTypePrestataire.libelle : '-';
            },
        },
        {
            title: 'Nature',
            dataIndex: 'nature',
            key: 'nature',
            render: (natureId) => {
                const nature = natures.find(nature => nature.id === natureId);
                return nature ? nature.libelle : '-';
            },
        },
        {
            title: 'Date Debut',
            dataIndex: 'date_debut',
            key: 'date_debut',
        },
       

        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        style={{
                            backgroundColor: record.etat==0 ? '#80BFB4' : 'lightgray',
                            borderColor: record.etat==0 ? '#80BFB4' : 'lightgray',
                            color: record.etat==0 ? 'white' : 'darkgray',
                            cursor: record.etat==0 ? 'pointer' : 'not-allowed',
                        }}
                        onClick={() => handleEdit(record)}
                        disabled={record.etat==1}
                    >
                        <EditOutlined /> Modifier
                    </Button>
                    <Button
                        style={{
                            backgroundColor: record.etat==0 ? '#36594C' : 'lightgray',
                            borderColor: record.etat==0? '#36594C' : 'lightgray',
                            color: record.etat==0 ? 'white' : 'darkgray',
                            cursor: record.etat==0 ? 'pointer' : 'not-allowed',
                        }}
                        onClick={() => handleDelete(record)}
                        disabled={record.etat==1}
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

    return (
        <div style={{ padding: '20px 130px' }}  >
            <h1>BAREMES</h1>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>


                <Button style={{ backgroundColor: '#588C7E', color: 'white' }} onClick={handleShowAddModal} >
                    <PlusCircleOutlined /> Ajouter un barème
                </Button>
                <Select
                    style={{ width: 400 }}
                    placeholder="Type barème"
                    value={selectedType}
                    onChange={handleTypeSelect}
                >
                    {typeBareme && typeBareme.map((value, index) => (
                        <Option key={index} value={value}>
                            {value}
                        </Option>
                    ))}
                </Select>

                <Select style={{ width: 400 }} placeholder="Code Acte">
                    {codeActes && codeActes.map((value) => (
                        <Option key={value.id} value={value.id}>
                            {value.libelle}
                        </Option>
                    ))}
                </Select>
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
                    dataSource={baremesData}
                    columns={columns}
                    loading={isLoading}
                    rowKey="id"
                    onChange={handleTableChange}
                />
            </div>
            <ToastContainer />
            <AddBaremeModal
             isVisible={isAddModalVisible}
             onClose={handleCloseAddModal}
             onCancel={handleCloseAddModal}
            ></AddBaremeModal>
            <UpdateBaremeModal
             isVisible={isUpdateModalVisible}
             onClose={handleCloseUpdateModal}
             onCancel={handleCloseUpdateModal}
             initialData={selectedBareme}
            ></UpdateBaremeModal>

            <DeleteConfirmationModal
             isVisible={isConfirmationModalVisible}
             onClose={handleCloseDeleteConfirmationModal}
             onCancel={handleCloseDeleteConfirmationModal}
             bareme={selectedBareme}
            ></DeleteConfirmationModal>


        </div>

    );
};

export default BaremesMainPage;
