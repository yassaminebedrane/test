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
import { getCodeActes, getCodeSousActes, getCodeSousActesByCodeActe } from '../../api/baremesApi';
// import AddBaremeModal from './AddBaremeModal';
// import UpdateBaremeModal from './UpdateBaremeModal';
// import DeleteConfirmationModal from './DeleteConfirmationModal';




function ActesMainPage() {
    const [selectedCodeActe, setSelectedCodeActe] = useState(null);
    const [selectedCodeSousActe, setSelectedCodeSousActe] = useState(null);
    const [codeSousActes, setCodeSousActes] = useState([]);
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);


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
        },
    ];


    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error fetching data</div>;
    }

  
    
    
  
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
          <Table
            columns={columnsCodeSousActes}
            dataSource={data}
            pagination={false}
            rowKey="id"
          />
        );
      };

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
        columns={columnsCodeActes}
        expandable={{
          expandedRowRender: (record) => (
            <CodeSousActesTable codeActeId={record.id} />
          ),
          rowExpandable: (record) => true, 
        }}
        rowKey="id"
      />
        </div>
        </div>
        
    );
};


export default ActesMainPage

// import React, { useState } from 'react';
// import { Table, Button, Space } from 'antd';
// import Highlighter from 'react-highlight-words';
// import { useQuery } from 'react-query'; // Import useQuery
// import { getCodeActes, getCodeSousActesByCodeActe } from '../../api/baremesApi';

// // ... Rest of your imports and code

// const ActesMainPage = () => {
//   const { isLoading, isError, data: codeActes } = useQuery('codeActes', getCodeActes);
//   const [expandedRowKeys, setExpandedRowKeys] = useState([]);

//   const columnsCodeActes = [
//     // ... Your Code Actes columns
//   ];

  

//   const toggleExpand = (codeActeId) => {
//     if (expandedRowKeys.includes(codeActeId)) {
//       // If the row is already expanded, collapse it
//       setExpandedRowKeys([]);
//     } else {
//       // Expand the row
//       setExpandedRowKeys([codeActeId]);
//     }
//   };

//   return (
//     <div>
//       <Table
//         dataSource={codeActes}
//         columns={columnsCodeActes}
//         expandable={{
//           expandedRowRender: (record) => (
//             <CodeSousActesTable codeActeId={record.id} />
//           ),
//           rowExpandable: (record) => true, // All rows are expandable
//         }}
//         rowKey="id"
//       />
//     </div>
//   );
// };

// const CodeSousActesTable = ({ codeActeId }) => {
//   const { data, isLoading, isError } = useQuery(['codeSousActes', codeActeId], () =>
//     getCodeSousActesByCodeActe(codeActeId)
//   );

//   const columnsCodeSousActes = [
//     {
//       title: 'ID',
//       dataIndex: 'id',
//       key: 'id',
//     },
//     {
//       title: 'Libelle',
//       dataIndex: 'libelle',
//       key: 'libelle',
//     },
//   ];

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (isError) {
//     return <div>Error fetching data</div>;
//   }

//   return (
//     <Table
//       columns={columnsCodeSousActes}
//       dataSource={data}
//       pagination={false}
//       rowKey="id"
//     />
//   );
// };

// export default ActesMainPage;
