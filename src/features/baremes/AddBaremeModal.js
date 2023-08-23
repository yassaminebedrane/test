import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Switch, DatePicker, Button, Select } from 'antd';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { ToastContainer, toast, Slide } from 'react-toastify';
import { addBareme, getCodeActes, getCodeSousActesByCodeActe, getCodeTypePrestataires, getNatures } from '../../api/baremesApi';
import 'react-toastify/dist/ReactToastify.css';


const AddBaremeModal = ({ isVisible, onClose, onSubmit }) => {

    const [form] = Form.useForm();
    const [codeActes, setCodeActes] = useState([]);
    const [codeSousActes, setCodeSousActes] = useState([]);
    const [selectedCodeActe, setSelectedCodeActe] = useState(null);
    const [selectedCodeSousActe, setSelectedCodeSousActe] = useState(null);

    const [selectedType, setSelectedType] = useState('');
    const [codeTypePrestataires, setCodeTypePrestataires] = useState([]);
    const [natures, setNatures] = useState([]);


    const { Option } = Select;

    const queryClient = useQueryClient();

   
    const typeBareme = [
        'FMSAR', 'AMO', 'CNOPS', 'WAFA1',
        'HP0', 'CHU',
        'HP', 'CHUCNOPS', 'HPCNOPS',
        'SECTMUT',
    ];


    useEffect(() => {
        async function fetchCodeActes() {
            try {
                const data = await getCodeActes();
                setCodeActes(data);
            } catch (error) {
                console.error('Error fetching code actes:', error);
            }
        }
        fetchCodeActes();
    }, []);

    useEffect(() => {
        async function fetchCodeSousActes() {
            if (selectedCodeActe) {
                try {
                    const data = await getCodeSousActesByCodeActe(selectedCodeActe);
                    setCodeSousActes(data);
                } catch (error) {
                    console.error('Error fetching code sous actes:', error);
                }
            } else {
                setCodeSousActes([]);
            }
        }
        fetchCodeSousActes();
    }, [selectedCodeActe]);

    const handleCodeActeSelect = (value) => {
        setSelectedCodeActe(value);
        setSelectedCodeSousActe(null);
    };

    useEffect(() => {
        fetchCodeTypePrestataires();
        fetchNatures();
    }, []);

    const fetchCodeTypePrestataires = async () => {
        const data = await getCodeTypePrestataires();
        setCodeTypePrestataires(data);
    };

    const fetchNatures = async () => {
        const data = await getNatures();
        setNatures(data);
    };


    const addBaremeMutation = useMutation(addBareme, {
        onSuccess: () => {
            queryClient.invalidateQueries('baremes');
        }
    });


    const handleFormSubmit = async () => {
        try {
            const values = await form.validateFields();
            
            const newBareme = {
                ...values,
                etat: 0
            };
    
            await addBaremeMutation.mutateAsync(newBareme);
            form.resetFields();
            onClose();
            showToastMessage();
    
        } catch (error) {
            console.error('Form validation error:', error);
        }
    };
    
    

    const showToastMessage = () => {
        toast.success('Bareme ajouté avec succès', {
            position: toast.POSITION.TOP_CENTER,
            transition: Slide,
            autoClose: 3000,
            hideProgressBar: true, 
            closeOnClick: true, 
            pauseOnHover: true, 
        });
    };
    const handleCancel = () => {
        form.resetFields();
        onClose();
    };

    return (
        <Modal
            title="Ajouter un nouveau barème"
            open={isVisible}
            onCancel={handleCancel}
            onOk={handleFormSubmit}
            okText="Confirmer"
            cancelText="Annuler"
            okButtonProps={{
                style: { backgroundColor: '#02A676', borderColor: '#02A676' },

            }}

        >
            <Form form={form} layout="vertical">
            <Form.Item name="type_bareme" label="Type Barème" rules={[{ required: true }]}>
                    <Select
                        placeholder="Type barème"
                    >
                        {typeBareme && typeBareme.map((value, index) => (
                            <Option key={index} value={value}>
                                {value}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                
                <Form.Item name="code_acte" label="Code Acte" rules={[{ required: true }]}>
                    <Select placeholder="Select a Code Acte"
                        onChange={handleCodeActeSelect}
                        value={selectedCodeActe}>
                        {codeActes.map((codeActe) => (
                            <Option key={codeActe.id} value={codeActe.id}>
                                {codeActe.libelle}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>


                <Form.Item name="code_sous_acte" label="Code Sous Acte" rules={[{ required: true }]}>
                    <Select placeholder="Select a Code Sous Acte" disabled={!selectedCodeActe}
                    value={selectedCodeSousActe}>
                        {codeSousActes.map((codeSousActe) => (
                            <Option key={codeSousActe.id} value={codeSousActe.id}>
                                {codeSousActe.libelle}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>


               


                <Form.Item name="type_tarif" label="Type Tarif" rules={[{ required: true }]}>
                    <Select placeholder="Select a Type Tarif">
                        <Option value="P">Forfaitaire</Option>
                        <Option value="U">Unitaire</Option>
                    </Select>
                </Form.Item>


                <Form.Item name="type_lette" label="Type Lettre" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="montant" label="Montant" rules={[{ required: true }]}>
                    <Input type="number" />
                </Form.Item>
                <Form.Item name="taux_remboursement" label="Taux Remboursement" rules={[{ required: true }]}>
                    <Input type="number" />
                </Form.Item>
                <Form.Item name="taux_remboursement_public" label="Taux Remboursement Public" rules={[{ required: true }]}>
                    <Input type="number" />
                </Form.Item>
                <Form.Item name="plafond" label="Plafond" rules={[{ required: true }]}>
                    <Input type="number" />
                </Form.Item>
                <Form.Item name="periode" label="Période" rules={[{ required: true }]}>
                    <Input type="number" />
                </Form.Item>
                <Form.Item name="cotation" label="Cotation" rules={[{ required: true }]}>
                    <Input type="number" />
                </Form.Item>
                <Form.Item name="code_type_prestataire" label="Code Type Prestataire" rules={[{ required: true }]}>
                    <Select placeholder="Select a Code Type Prestataire">
                        {codeTypePrestataires.map((item) => (
                            <Option key={item.id} value={item.id}>
                                {item.libelle} 
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name="nature" label="Nature" rules={[{ required: true }]}>
                    <Select placeholder="Select a Nature">
                        {natures.map((item) => (
                            <Option key={item.id} value={item.id}>
                                {item.libelle}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name="date_debut" label="Date Début" rules={[{ required: true }]}>
                    <DatePicker />
                </Form.Item>


            </Form>

        </Modal>
    );
};

export default AddBaremeModal;
