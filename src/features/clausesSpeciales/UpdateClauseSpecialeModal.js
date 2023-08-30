import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Switch, DatePicker, Button, Select } from 'antd';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { ToastContainer, toast, Slide } from 'react-toastify';
import { updateClauseSpeciale } from '../../api/clausesSpecialesApi';
import 'react-toastify/dist/ReactToastify.css';


const UpdateClauseSpecialeModal = ({ isVisible, onClose, initialData }) => {

    const [form] = Form.useForm();

    const queryClient = useQueryClient();

    const { TextArea } = Input;


    useEffect(() => {
        if (isVisible && initialData) {
            form.setFieldsValue({
                libelle: initialData.libelle,
            });
        }
    }, [isVisible, initialData]);


    const updateClauseSpecialeMutation = useMutation(updateClauseSpeciale, {
        onSuccess: () => {
            queryClient.invalidateQueries('clausesSpeciales');
        }
    });



    const handleFormSubmit = async () => {
        try {
            const values = await form.validateFields();
            const updatedClauseSpeciale = { ...initialData, ...values };

            if (!areObjectsEqual(updatedClauseSpeciale, initialData)) {
                await updateClauseSpecialeMutation.mutateAsync(updatedClauseSpeciale);
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
        toast.success('Clause modifiée avec succès', {
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
            title="Modifier la clause"
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
                <Form.Item
                    name="libelle"
                    label="Libellé"
                    rules={[{ required: true, message: 'Champ obligatoire' }]}
                >
                    <TextArea rows={4} />
                </Form.Item>
            </Form>

        </Modal>
    );
};

export default UpdateClauseSpecialeModal;
