import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Switch, DatePicker, Button, Select } from 'antd';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { ToastContainer, toast, Slide } from 'react-toastify';
import { getPathologies, updateMaladie } from '../../api/pathologiesApi';
import 'react-toastify/dist/ReactToastify.css';


const UpdateMaladieModal = ({ isVisible, onClose, initialData }) => {

    const [form] = Form.useForm();
    const [pathologie, setPathologies] = useState([]);


    const { Option } = Select;

    const queryClient = useQueryClient();
    useEffect(() => {
        async function fetchPathologies() {
            try {
                const data = await getPathologies();
                setPathologies(data);
            } catch (error) {
                console.error('Error fetching code actes:', error);
            }
        }
        fetchPathologies();
    }, []);



    useEffect(() => {
        if (isVisible && initialData) {
            form.setFieldsValue({
                pathologie_id: initialData.pathologie_id,
                libelle: initialData.libelle,
                type: initialData.type
            });
        }
    }, [isVisible, initialData]);

    const updateMaladieMutation = useMutation(updateMaladie, {
        onSuccess: () => {
            queryClient.invalidateQueries('pathologies');
            queryClient.invalidateQueries('maladies');
        }
    });

    const handleFormSubmit = async () => {
        try {
            const values = await form.validateFields();
            const updatedMaladie = { ...initialData, ...values };
            console.log(values)

            if (!areObjectsEqual(updatedMaladie, initialData)) {
                await updateMaladieMutation.mutateAsync(updatedMaladie);
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
        toast.success('Maladie modifiée avec succès', {
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
            title="Modifier une maladie"
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
                        {pathologie.map((Pathologie) => (
                            <Option key={Pathologie.id} value={Pathologie.id}>
                                {Pathologie.libelle}
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

export default UpdateMaladieModal;
