import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Switch, DatePicker, Button, Select } from 'antd';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { ToastContainer, toast, Slide } from 'react-toastify';
import { updateLettre, getTypesCorrespondances } from '../../api/lettresApi';
import 'react-toastify/dist/ReactToastify.css';


const UpdateLettreModal = ({ isVisible, onClose, onSubmit, initialData }) => {

    const [form] = Form.useForm();

    const { TextArea } = Input;
    const { Option } = Select;


    const queryClient = useQueryClient();

    const updateLettreMutation = useMutation(updateLettre, {
        onSuccess: () => {
            queryClient.invalidateQueries('lettres');
        }
    });

    const { data: typesCorrespondances } = useQuery('type_correspondance', getTypesCorrespondances);

    useEffect(() => {
        if (initialData) {
           
                form.setFieldsValue({
                    texte:initialData.texte,
                    type_correspondance_id:initialData.type_correspondance_id,
                });
            

        }
    }, [isVisible, initialData, form]);



    const handleFormSubmit = async () => {
        try {
            const values = await form.validateFields();
            const updatedLettre = { ...initialData, ...values };

            if (!areObjectsEqual(updatedLettre, initialData)) {
                const newLettre = {
                    ...updatedLettre,
                    etat: initialData.etat
                };
                await updateLettreMutation.mutateAsync(newLettre);
                form.resetFields();
                onClose();
                showToastMessage();
            } else {
                onClose();
            }
        } catch (error) {
            console.error('Form validation error:', error);
        }
    };

    const areObjectsEqual = (obj1, obj2) => {
        return JSON.stringify(obj1) === JSON.stringify(obj2);
    };


    const showToastMessage = () => {
        toast.success('Lettre modifiée avec succès', {
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
            title="Modifier la lettre"
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
            <Form.Item name="type_correspondance_id" label="Type correspondance" rules={[{ required: true }]}>
                    <Select
                    >
                        {typesCorrespondances.map((typeCorrespondance) => (
                            <Option key={typeCorrespondance.id} value={typeCorrespondance.id}>
                                {typeCorrespondance.libelle}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="texte"
                    label="Lettre"
                    rules={[{ required: true, message: 'Champ obligatoire' }]}
                >
                    <TextArea rows={10} />
                </Form.Item>
                

            </Form>

        </Modal>
    );
};

export default UpdateLettreModal;
