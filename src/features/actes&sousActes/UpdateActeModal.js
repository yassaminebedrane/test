import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Switch, DatePicker, Button, Select } from 'antd';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { ToastContainer, toast, Slide } from 'react-toastify';
import { updateCodeActe } from '../../api/codesActes&SousActesApi';
import 'react-toastify/dist/ReactToastify.css';


const UpdateActeModal = ({ isVisible, onClose , initialData}) => {

    const [form] = Form.useForm();

    const queryClient = useQueryClient();

    
    useEffect(() => {
        if (isVisible && initialData) {
          form.setFieldsValue({
           libelle:initialData.libelle,
          });
        }
      }, [isVisible, initialData]);


      const handleFormSubmit = async () => {
        try {
          const values = await form.validateFields();
          const updatedCodeActe = { ...initialData, ...values };
          console.log(values)
          
          if (!areObjectsEqual(updatedCodeActe, initialData)) {
            await updateActeMutation.mutateAsync(updatedCodeActe);
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
      
    
      const updateActeMutation = useMutation(updateCodeActe, {
        onSuccess: () => {
          queryClient.invalidateQueries('codeActes');
        }
      });
    
    
      const showToastMessage = () => {
        toast.success('Code acte modifié avec succès', {
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
            title="Modifier le code acte"
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
                <Form.Item name="libelle" label="Libellé" rules={[{ required: true , message: 'Champ obligatoire'}]}>
                    <Input />
                </Form.Item>
            </Form>

        </Modal>
    );
};

export default UpdateActeModal;
