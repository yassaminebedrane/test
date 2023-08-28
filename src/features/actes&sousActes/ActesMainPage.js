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
import { getCodeActes, getCodeSousActes, getCodeSousActesByCodeActe } from '../../api/baremesApi';
import AddActeModal from './AddActeModal'
import UpdateActeModal from './UpdateActeModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import AddCodeSousActeModal from './AddCodeSousActeModal';
import UpdateCodeSousActeModal from './UpdateCodeSousActeModal';
import enUS from 'antd/lib/locale/en_US';






function ActesMainPage() {
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  const [isAddActeModalVisible, setIsAddActeModalVisible] = useState(false);
  const [isUpdateActeModalVisible, setIsUpdateActeModalVisible] = useState(false);
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
  const [selectedCode, setSelectedCode] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  const [isAddCodeSousActeModalVisible, setIsAddCodeSousActeModalVisible] = useState(false)
  const [isUpdateCodeSousActeModalVisible, setIsUpdateCodeSousActeModalVisible] = useState(false)

  const [globalSearchText, setGlobalSearchText] = useState('');




  const queryClient = useQueryClient();

  const { isLoading, isError, data: codeActes } = useQuery('codeActes', getCodeActes);

  const columnsCodeActes = [
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
            onClick={() => handleUpdateCodeActe(record)}          >
            <EditOutlined /> Modifier
          </Button>
          <Button
            style={{
              backgroundColor: '#36594C',
              borderColor: '#36594C',
              color: 'white',
              cursor: 'pointer',
            }}
            onClick={() => handleDeleteCodeActe(record)}
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


  const filteredCodes = globalSearchText
    ? codeActes.filter((codeActe) =>
      Object.values(codeActe).some((value) =>
        value.toString().toLowerCase().includes(globalSearchText.toLowerCase())
      )
    )
    : codeActes;

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
    setIsAddActeModalVisible(true);
  };

  const handleCloseAddActeModal = () => {
    setIsAddActeModalVisible(false);
    queryClient.invalidateQueries('codeActes');

  };

  const handleShowUpdateActeModal = () => {
    setIsUpdateActeModalVisible(true);
  };

  const handleCloseUpdateActeModal = () => {
    setIsUpdateActeModalVisible(false);
    queryClient.invalidateQueries('codeActes');

  };

  const handleUpdateCodeActe = (record) => {
    console.log("record:", record);
    setSelectedCode(record);
    console.log("selected", selectedCode)
    handleShowUpdateActeModal();
  };

  const handleShowDeleteConfirmationModal = () => {
    setIsConfirmationModalVisible(true);
  };

  const handleCloseDeleteConfirmationModal = () => {
    setIsConfirmationModalVisible(false);

  };

  const handleDeleteCodeActe = (record) => {
    setSelectedCode(record);
    console.log("acte deletion", selectedCode)
    setSelectedType("acte");
    handleShowDeleteConfirmationModal();
  };
  const handleDeleteCodeSousActe = (record) => {
    setSelectedCode(record);
    setSelectedType("sousActe");
    handleShowDeleteConfirmationModal();
  };


  const handleShowAddCodeSousActeModal = () => {
    setIsAddCodeSousActeModalVisible(true);
  };

  const handleCloseAddCodeSousActeModal = () => {
    setIsAddCodeSousActeModalVisible(false);
    queryClient.invalidateQueries('codeActes');

  };
  const handleShowUpdateCodeSousActeModal = () => {
    setIsUpdateCodeSousActeModalVisible(true);
  };

  const handleCloseUpdateCodeSousActeModal = () => {
    setIsUpdateCodeSousActeModalVisible(false);
    queryClient.invalidateQueries('codeActes');

  };

  const handleUpdateCodeSousActe = (record) => {
    console.log("record:", record);
    setSelectedCode(record);
    console.log("selected", selectedCode)
    handleShowUpdateCodeSousActeModal();
  };

  //END MODAL RELATED FUNCTIONS



  const toggleExpand = (codeActeId) => {
    if (expandedRowKeys.includes(codeActeId)) {
      // If the row is already expanded, collapse it
      setExpandedRowKeys([]);
    } else {
      // Expand the row
      setExpandedRowKeys([codeActeId]);
    }
  };

  const CodeSousActesTable = ({ codeActeId }) => {
    const { data, isLoading, isError } = useQuery(['codeSousActes', codeActeId], () =>
      getCodeSousActesByCodeActe(codeActeId)
    );

    const columnsCodeSousActes = [
      // {
      //   title: 'ID',
      //   dataIndex: 'id',
      //   key: 'id',
      //   className: 'code-sous-actes-column',
      // },
      {
        title: 'Libelle Code Sous Acte',
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
        title: 'Actions',
        dataIndex: 'actions',
        key: 'actions',
        className: 'code-sous-actes-column',
        render: (_, record) => (
          <Space size="small">
            <Button
              className="code-sous-actes-cell"
              style={{
                backgroundColor: '#80BFB4',
                borderColor: '#80BFB4',
                color: 'white',
                cursor: 'pointer',
              }}
              onClick={() => handleUpdateCodeSousActe(record)}            >
              <EditOutlined /> Modifier
            </Button>
            <Button
              className="code-sous-actes-cell"
              style={{
                backgroundColor: '#36594C',
                borderColor: '#36594C',
                color: 'white',
                cursor: 'pointer',
              }}
              onClick={() => handleDeleteCodeSousActe(record)}            >


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
      <div className="code-sous-actes-table-wrapper">
        <Table
          columns={columnsCodeSousActes}
          dataSource={data}
          pagination={false}
          rowKey="id"
        />
      </div>
    );
  };

  return (

    <div style={{ padding: '20px 130px' }}  >
      <h1>CODES ACTES</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>


        <Button style={{ backgroundColor: '#588C7E', color: 'white' }}
          onClick={handleShowAddModal}>
          <PlusCircleOutlined /> Ajouter un code acte
        </Button>
        <Button style={{ backgroundColor: '#588C7E', color: 'white' }}
          onClick={handleShowAddCodeSousActeModal}>
          <PlusCircleOutlined /> Ajouter un code sous acte
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
          dataSource={filteredCodes}
          columns={columnsCodeActes}
          expandable={{
            expandedRowRender: (record) => (
              <CodeSousActesTable codeActeId={record.id} />
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
      <AddActeModal
        isVisible={isAddActeModalVisible}
        onClose={handleCloseAddActeModal}
        onCancel={handleCloseAddActeModal}
      ></AddActeModal>

      <UpdateActeModal
        isVisible={isUpdateActeModalVisible}
        onClose={handleCloseUpdateActeModal}
        onCancel={handleCloseUpdateActeModal}
        initialData={selectedCode}

      ></UpdateActeModal>

      <DeleteConfirmationModal
        isVisible={isConfirmationModalVisible}
        onClose={handleCloseDeleteConfirmationModal}
        onCancel={handleCloseDeleteConfirmationModal}
        code={selectedCode}
        type={selectedType}
      ></DeleteConfirmationModal>


      <AddCodeSousActeModal
        isVisible={isAddCodeSousActeModalVisible}
        onClose={handleCloseAddCodeSousActeModal}
        onCancel={handleCloseAddCodeSousActeModal}
      ></AddCodeSousActeModal>
      <UpdateCodeSousActeModal
        isVisible={isUpdateCodeSousActeModalVisible}
        onClose={handleCloseUpdateCodeSousActeModal}
        onCancel={handleCloseUpdateCodeSousActeModal}
        initialData={selectedCode}
      ></UpdateCodeSousActeModal>



      <ToastContainer></ToastContainer>
    </div>

  );
};


export default ActesMainPage


