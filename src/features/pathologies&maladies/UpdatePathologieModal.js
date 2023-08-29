import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Switch, DatePicker, Button, Select } from 'antd';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { ToastContainer, toast, Slide } from 'react-toastify';
import { updatePathologie } from '../../api/pathologiesApi';
import 'react-toastify/dist/ReactToastify.css';


const UpdatePathologieModal = ({ isVisible, onClose, initialData }) => {

    const [form] = Form.useForm();

    const queryClient = useQueryClient();

    const { Option } = Select;

    useEffect(() => {
        if (isVisible && initialData) {
            form.setFieldsValue({
                libelle: initialData.libelle,
                type:initialData.type,
            });
        }
    }, [isVisible, initialData]);

    const updatePathologieMutation = useMutation(updatePathologie, {
        onSuccess: () => {
            queryClient.invalidateQueries('pathologies');
        }
    });


    const handleFormSubmit = async () => {
        try {
            const values = await form.validateFields();
            const updatedPathologie = { ...initialData, ...values };
            console.log(values)

            if (!areObjectsEqual(updatedPathologie, initialData)) {
                await updatePathologieMutation.mutateAsync(updatedPathologie);
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
        toast.success('Pathologie modifiée avec succès', {
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
            title="Modifier la pathologie"
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
                <Form.Item name="libelle" label="Libellé" rules={[{ required: true, message: 'Champ obligatoire' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="type" label="Type" rules={[{ required: true }]}>
                    <Select placeholder="Selectionnez un Type">
                        <Option value="ME">Médicale</Option>
                        <Option value="OP">Optique</Option>
                        <Option value="DE">Dentaire</Option>
                    </Select>
                </Form.Item>
            </Form>

        </Modal>
    );
};

export default UpdatePathologieModal;
