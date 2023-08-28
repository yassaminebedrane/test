import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Switch, DatePicker, Button, Select } from 'antd';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { ToastContainer, toast, Slide } from 'react-toastify';
import { addCodeActe } from '../../api/codesActes&SousActesApi';
import 'react-toastify/dist/ReactToastify.css';


const AddActeModal = ({ isVisible, onClose }) => {

    const [form] = Form.useForm();

    const { Option } = Select;

    const queryClient = useQueryClient();


    const addCodeActeMutation = useMutation(addCodeActe, {
        onSuccess: () => {
            queryClient.invalidateQueries('codeActes');
        }
    });


    const handleFormSubmit = async () => {
        try {
            const values = await form.validateFields();

            await addCodeActeMutation.mutateAsync(values);
            form.resetFields();
            onClose();
            showToastMessage();

        } catch (error) {
            console.error('Form validation error:', error);
        }
    };



    const showToastMessage = () => {
        toast.success('Code acte ajouté avec succès', {
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
            title="Ajouter un nouveau code acte"
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
                <Form.Item name="libelle" label="Libellé" rules={[{ required: true , message: 'Champ obligatoire' }]}>
                    <Input />
                </Form.Item>
            </Form>

        </Modal>
    );
};

export default AddActeModal;
