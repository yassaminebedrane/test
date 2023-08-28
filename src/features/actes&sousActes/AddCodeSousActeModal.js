import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Switch, DatePicker, Button, Select } from 'antd';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { ToastContainer, toast, Slide } from 'react-toastify';
import { addCodeSousActe, getCodeActes } from '../../api/codesActes&SousActesApi';
import 'react-toastify/dist/ReactToastify.css';


const AddCodeSousActeModal = ({ isVisible, onClose }) => {

    const [form] = Form.useForm();
    const [codeActes, setCodeActes] = useState([]);


    const { Option } = Select;

    const queryClient = useQueryClient();
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

    const addCodeSousActeMutation = useMutation(addCodeSousActe, {
        onSuccess: () => {
            queryClient.invalidateQueries('codeSousActes');
        }
    });


    const handleFormSubmit = async () => {
        try {
            const values = await form.validateFields();

            await addCodeSousActeMutation.mutateAsync(values);
            form.resetFields();
            onClose();
            showToastMessage();

        } catch (error) {
            console.error('Form validation error:', error);
        }
    };



    const showToastMessage = () => {
        toast.success('Code sous acte ajouté avec succès', {
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
            title="Ajouter un nouveau code sous acte"
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
                <Form.Item name="code_acte" label="Code Acte" rules={[{ required: true, message: 'Champ obligatoire' }]}>
                    <Select
                        placeholder="Select a Code Acte"
                    >
                        {codeActes.map((codeActe) => (
                            <Option key={codeActe.id} value={codeActe.id}>
                                {codeActe.libelle}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item name="libelle" label="Libellé" rules={[{ required: true, message: 'Champ obligatoire' }]}>
                    <Input />
                </Form.Item>

            </Form>

        </Modal>
    );
};

export default AddCodeSousActeModal;
