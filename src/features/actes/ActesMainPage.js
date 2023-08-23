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
import AddBaremeModal from './AddBaremeModal';
import UpdateBaremeModal from './UpdateBaremeModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';




function ActesMainPage() {
    return (
        <div>ActesMainPage</div>
    )
}

export default ActesMainPage