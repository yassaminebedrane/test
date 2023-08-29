import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Switch, DatePicker, Button, Select } from 'antd';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { ToastContainer, toast, Slide } from 'react-toastify';
import { addMaladie, getMaladiesByPathologieId, getPathologies } from '../../api/pathologiesApi';
import 'react-toastify/dist/ReactToastify.css';


const AddMaladieModal = ({ isVisible, onClose }) => {

    const [form] = Form.useForm();
    const [pathologies, setPathologies] = useState([]);


    const { Option } = Select;

    const queryClient = useQueryClient();
    useEffect(() => {
        async function fetchPathologies() {
            try {
                queryClient.invalidateQueries('pathologies');
                const data = await getPathologies();
                setPathologies(data);
            } catch (error) {
                console.error('Error fetching code actes:', error);
            }
        }
        fetchPathologies();
    }, []);

    const addMaladieMutation = useMutation(addMaladie, {
        onSuccess: () => {
            queryClient.invalidateQueries('maladies');
        }
    });


    const handleFormSubmit = async () => {
        try {
            const values = await form.validateFields();

            const newMaladie = {
                ...values,
                etat: 0
            };

            await addMaladieMutation.mutateAsync(newMaladie);
            form.resetFields();
            onClose();
            showToastMessage();

        } catch (error) {
            console.error('Form validation error:', error);
        }
    };



    const showToastMessage = () => {
        toast.success('Maladie ajoutée avec succès', {
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
            title="Ajouter une nouvelle maladie"
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
                <Form.Item name="pathologie_id" label="Pathologie correspondante" rules={[{ required: true, message: 'Champ obligatoire' }]}>
                    <Select
                        placeholder="Selectionnez une pathologie"
                    >
                        {pathologies.map((pathologie) => (
                            <Option key={pathologie.id} value={pathologie.id}>
                                {pathologie.libelle}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item name="libelle" label="Libellé" rules={[{ required: true, message: 'Champ obligatoire' }]}>
                    <Input />
                </Form.Item>

                <Form.Item name="type" label="Chronique ou non chronique" rules={[{ required: true }]}>
                    <Select placeholder="Selectionnez un Type">
                        <Option value="CH">Chronique</Option>
                        <Option value="NCH">Non chronique</Option>
                    </Select>
                </Form.Item>

            </Form>

        </Modal>
    );
};

export default AddMaladieModal;
