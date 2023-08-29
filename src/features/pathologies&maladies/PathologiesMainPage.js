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
import enUS from 'antd/lib/locale/en_US';
import { getPathologies, getMaladiesByPathologieId, updateMaladie, filterPathologies } from '../../api/pathologiesApi';

import AddPathologieModal from './AddPathologiesModal';
import AddMaladieModal from './AddMaladieModal';
import UpdatePathologieModal from './UpdatePathologieModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import UpdateMaladieModal from './UpdateMaladieModal';




function PathologiesMainPage() {


  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  const [isAddPathologieModalVisible, setIsAddPathologieModalVisible] = useState(false);
  const [isUpdatePathologieModalVisible, setIsUpdatePathologieModalVisible] = useState(false);
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
  const [selectedPathologie, setSelectedPathologie] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedTypePathologie, setSelectedTypePathologie] = useState(null);
  const [isAddMaladieModalVisible, setIsAddMaladieModalVisible] = useState(false)
  const [isUpdateMaladieModalVisible, setIsUpdateMaladieModalVisible] = useState(false)
  const [globalSearchText, setGlobalSearchText] = useState('');

  const queryClient = useQueryClient();

  const { Option } = Select;


  const { isLoading, isError, data: pathologies } = useQuery('pathologies', getPathologies);

  const updateMaladieMutation = useMutation(updateMaladie, {
    onSuccess: () => {
      queryClient.invalidateQueries('maladies');
    }
  });

  const { data: filteredData } = useQuery(
    ['filteredPathologies', selectedTypePathologie],
    () => filterPathologies(selectedTypePathologie),
    {
      enabled: selectedTypePathologie !== null,
      refetchOnWindowFocus: false,
    }
  );

  const columnsPathologies = [
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
      title: 'Type Pathologie',
      dataIndex: 'type',
      key: 'type',
      render: (type) => {
        return renderHighlightedColumn((type === 'ME' ? 'Médicale' : (type === 'OP' ? 'Optique' : (type === 'DE' ? 'Dentaire' : 'Unknown'))))
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
            onClick={() => handleUpdatePathologie(record)}
          >
            <EditOutlined /> Modifier
          </Button>
          <Button
            style={{
              backgroundColor: '#36594C',
              borderColor: '#36594C',
              color: 'white',
              cursor: 'pointer',
            }}
            onClick={() => handleDeletePathologie(record)}


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



  const filteredPathologies = filteredData
    ? filteredData.filter((pathologie) => {
      let matchesSearch = false;
      for (const [key, value] of Object.entries(pathologie)) {
        let searchableValue = value;
        switch (key) {
          case "type":
            searchableValue = value === "ME" ? "Médicale" : value === "OP" ? "Optique" : value === "DE" ? "Dentaire" : "";
            break;
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
    : pathologies;

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

  const handleShowAddPathologieModal = () => {
    setIsAddPathologieModalVisible(true);
  };

  const handleCloseAddPathologieModal = () => {
    setIsAddPathologieModalVisible(false);
    queryClient.invalidateQueries('pathologies');

  };

  const handleShowUpdatePathologieModal = () => {
    setIsUpdatePathologieModalVisible(true);
  };

  const handleCloseUpdatePathologieModal = () => {
    setIsUpdatePathologieModalVisible(false);
    queryClient.invalidateQueries('pathologies');

  };

  const handleUpdatePathologie = (record) => {
    console.log("record:", record);
    setSelectedPathologie(record);
    console.log("selected", selectedPathologie)
    handleShowUpdatePathologieModal();
  };

  const handleShowDeleteConfirmationModal = () => {
    setIsConfirmationModalVisible(true);
  };

  const handleCloseDeleteConfirmationModal = () => {
    setIsConfirmationModalVisible(false);

  };

  const handleDeletePathologie = (record) => {
    setSelectedPathologie(record);
    setSelectedType("pathologie");
    handleShowDeleteConfirmationModal();
  };
  const handleDeleteMaladie = (record) => {
    setSelectedPathologie(record);
    setSelectedType("maladie");
    handleShowDeleteConfirmationModal();
  };


  const handleShowAddMaladieModal = () => {
    setIsAddMaladieModalVisible(true);
  };

  const handleCloseAddMaladieModal = () => {
    setIsAddMaladieModalVisible(false);
    queryClient.invalidateQueries('pathologies');

  };
  const handleShowUpdateMaladieModal = () => {
    setIsUpdateMaladieModalVisible(true);
  };

  const handleCloseUpdateMaladieModal = () => {
    setIsUpdateMaladieModalVisible(false);
    queryClient.invalidateQueries('pathologies');

  };

  const handleUpdateMaladie = (record) => {
    console.log("record:", record);
    setSelectedPathologie(record);
    console.log("selected", selectedPathologie)
    handleShowUpdateMaladieModal();
  };

  const handleReactivate = async (record) => {
    const updatedMaladie = { ...record, etat: 0 };
    try {
      await updateMaladieMutation.mutateAsync(updatedMaladie);
      console.log('Maladie réactivée avec succès');
      queryClient.invalidateQueries('maladies');
    } catch (error) {
      console.error('Error reactivating maladie:', error);
    }
  };

  const handleTypePathologieSelect = async (value) => {
    setSelectedTypePathologie(value);
};

  //END MODAL RELATED FUNCTIONS



  const toggleExpand = (PathologieId) => {
    if (expandedRowKeys.includes(PathologieId)) {
      // If the row is already expanded, collapse it
      setExpandedRowKeys([]);
    } else {
      // Expand the row
      setExpandedRowKeys([PathologieId]);
    }
  };

  const MaladiesTable = ({ pathologieId }) => {
    const { data, isLoading, isError } = useQuery(['maladies', pathologieId], () =>
      getMaladiesByPathologieId(pathologieId)
    );

    const columnsMaladies = [
      // {
      //   title: 'ID',
      //   dataIndex: 'id',
      //   key: 'id',
      //   className: 'code-sous-actes-column',
      // },
      {
        title: 'Libelle Maladie',
        dataIndex: 'libelle',
        key: 'libelle',
        className: 'code-sous-actes-column',
        render: (text) => (
          <Highlighter
            highlightStyle={{ backgroundColor: 'rgba(2, 166, 118, 0.6)', color: 'white', padding: 0 }}
            searchWords={['searchText']}
            autoEscape
            textToHighlight={text.toString()}
          />
        ),
      },
      {
        title: 'Type Maladie',
        dataIndex: 'type',
        key: 'type',
        className: 'code-sous-actes-column',
        render: (type) => {
          return renderHighlightedColumn((type === 'CH' ? 'Chronique' : (type === 'NCH' ? 'Non chronique' : "-")))
        },
      },
      {
        title: 'Actions',
        dataIndex: 'actions',
        key: 'actions',
        className: 'code-sous-actes-column',
        render: (_, record) => (
          <Space size="small">
            <Button
              className="code-sous-actes-cell"
              style={{
                backgroundColor: record.etat == 0 ? '#80BFB4' : 'lightgray',
                borderColor: record.etat == 0 ? '#80BFB4' : 'lightgray',
                color: record.etat == 0 ? 'white' : 'darkgray',
                cursor: record.etat == 0 ? 'pointer' : 'not-allowed',
              }}
              onClick={() => handleUpdateMaladie(record)}
              disabled={record.etat == 1}
            >
              <EditOutlined /> Modifier
            </Button>
            <Button
              className="code-sous-actes-cell"
              style={{
                backgroundColor: record.etat == 0 ? '#36594C' : 'lightgray',
                borderColor: record.etat == 0 ? '#36594C' : 'lightgray',
                color: record.etat == 0 ? 'white' : 'darkgray',
                cursor: record.etat == 0 ? 'pointer' : 'not-allowed',
              }}
              onClick={() => handleDeleteMaladie(record)}
              disabled={record.etat == 1}
            >


              <DeleteOutlined /> Supprimer
            </Button>
            {record.etat == 1 && (
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

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (isError) {
      return <div>Error fetching data</div>;
    }

    return (
      <div className="code-sous-actes-table-wrapper">
        <Table
          columns={columnsMaladies}
          dataSource={data}
          pagination={false}
          rowKey="id"
        />
      </div>
    );
  };

  return (

    <div style={{ padding: '20px 130px' }}  >
      <h1>PATHOLOGIES</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>


        <Button style={{ backgroundColor: '#588C7E', color: 'white' }}
          onClick={handleShowAddPathologieModal}>
          <PlusCircleOutlined /> Ajouter une pathologie
        </Button>
        <Button style={{ backgroundColor: '#588C7E', color: 'white' }}
          onClick={handleShowAddMaladieModal}>
          <PlusCircleOutlined /> Ajouter une maladie
        </Button>
        <Select
          style={{ width: 400, marginRight: '10px',marginLeft: '10px' }}
          placeholder="Filtrer par type de pathologie"
          value={selectedTypePathologie}
          onChange={handleTypePathologieSelect}
          >
          <Option value="ME">Médicale</Option>
          <Option value="OP">Optique</Option>
          <Option value="DE">Dentaire</Option>
        </Select>
        <Button style={{ backgroundColor: '#588C7E', color: 'white', marginRight: '10px' }}
                    onClick={()=>setSelectedTypePathologie(null)} >Reinitialiser</Button>
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
            dataSource={filteredPathologies}
            columns={columnsPathologies}
            expandable={{
              expandedRowRender: (record) => (
                <MaladiesTable pathologieId={record.id} />
              ),
              rowExpandable: (record) => true,
            }}
            rowKey="id"
            locale={{
              emptyText: 'AUCUNE DONNEE',
            }}
          />
        </ConfigProvider>
      </div>
      <AddPathologieModal
        isVisible={isAddPathologieModalVisible}
        onClose={handleCloseAddPathologieModal}
        onCancel={handleCloseAddPathologieModal}
      ></AddPathologieModal>

      <AddMaladieModal
        isVisible={isAddMaladieModalVisible}
        onClose={handleCloseAddMaladieModal}
        onCancel={handleCloseAddMaladieModal}
      ></AddMaladieModal>

      <UpdatePathologieModal
        isVisible={isUpdatePathologieModalVisible}
        onClose={handleCloseUpdatePathologieModal}
        onCancel={handleCloseUpdatePathologieModal}
        initialData={selectedPathologie}

      ></UpdatePathologieModal>


      <DeleteConfirmationModal
        isVisible={isConfirmationModalVisible}
        onClose={handleCloseDeleteConfirmationModal}
        onCancel={handleCloseDeleteConfirmationModal}
        toDelete={selectedPathologie}
        type={selectedType}
      ></DeleteConfirmationModal>


      <UpdateMaladieModal
        isVisible={isUpdateMaladieModalVisible}
        onClose={handleCloseUpdateMaladieModal}
        onCancel={handleCloseUpdateMaladieModal}
        initialData={selectedPathologie}
      ></UpdateMaladieModal>



      <ToastContainer></ToastContainer>
    </div>

  );
};


export default PathologiesMainPage


