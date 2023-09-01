import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Switch, DatePicker, Button, Select } from 'antd';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { ToastContainer, toast, Slide } from 'react-toastify';
import { addLettre, getTypesCorrespondances } from '../../api/lettresApi';
import 'react-toastify/dist/ReactToastify.css';


const AddLettreModal = ({ isVisible, onClose }) => {

    const [form] = Form.useForm();

    const { TextArea } = Input;
    const { Option } = Select;


    const queryClient = useQueryClient();

    const addLettreMutation = useMutation(addLettre, {
        onSuccess: () => {
            queryClient.invalidateQueries('lettres');
        }
    });

    const { data: typesCorrespondances } = useQuery('type_correspondance', getTypesCorrespondances);


    const handleFormSubmit = async () => {
        try {
            const values = await form.validateFields();
            await addLettreMutation.mutateAsync(values);
            form.resetFields();
            onClose();
            showToastMessage();

        } catch (error) {
            console.error('Form validation error:', error);
        }
    };



    const showToastMessage = () => {
        toast.success('Lettre ajoutée avec succès', {
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
            title="Ajouter une nouvelle lettre"
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
                        {typesCorrespondances && typesCorrespondances.map((typeCorrespondance) => (
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

export default AddLettreModal;
