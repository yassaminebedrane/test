import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Switch, DatePicker, Button, Select } from 'antd';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { ToastContainer, toast, Slide } from 'react-toastify';
import { addCodeActe } from '../../api/codesActes&SousActesApi';
import 'react-toastify/dist/ReactToastify.css';


const AddPathologieModal = ({ isVisible, onClose }) => {

    const [form] = Form.useForm();

    const { Option } = Select;

    const queryClient = useQueryClient();


    const addPathologieMutation = useMutation(addPathologie, {
        onSuccess: () => {
            queryClient.invalidateQueries('pathologies');
        }
    });


    const handleFormSubmit = async () => {
        try {
            const values = await form.validateFields();

            await addPathologieMutation.mutateAsync(values);
            form.resetFields();
            onClose();
            showToastMessage();

        } catch (error) {
            console.error('Form validation error:', error);
        }
    };



    const showToastMessage = () => {
        toast.success('Pathologie ajoutée avec succès', {
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
            title="Ajouter une nouvelle pathologie"
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

export default AddPathologieModal;
