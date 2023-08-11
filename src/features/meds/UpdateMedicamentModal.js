import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Switch } from 'antd';
import { getMedicaments, addMedicament, updateMedicament, deleteMedicament } from '../../api/medicamentsApi';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const UpdateMedicamentModal = ({ isVisible, onClose, onSubmit, initialData }) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();


  useEffect(() => {
    if (isVisible && initialData) {
      form.setFieldsValue({
        nom: initialData.nom,
        prix_hospitalier: initialData.prix_hospitalier,
        tarif: initialData.tarif,
        denomination: initialData.denomination,
        prix_public: initialData.prix_public,
        nombre_de_boites: initialData.nombre_de_boites,
        etat: initialData.etat,
      });
    }
  }, [isVisible, initialData]);

  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();
      const updatedMedicament = { ...initialData, ...values };
      await updateMedicamentMutation.mutateAsync(updatedMedicament);
      form.resetFields();
      onClose();
      showToastMessage();
    } catch (error) {
      console.error('Form validation error:', error);
    }
  };

  const updateMedicamentMutation = useMutation(updateMedicament, {
    onSuccess: () => {
      queryClient.invalidateQueries('medicaments');
    }
  });

  
  const showToastMessage = () => {
    toast.success('Medicament updated successfully!', {
        position: toast.POSITION.TOP_CENTER
    });
};

  return (
    <Modal
      title="Modifier le médicament"
      visible={isVisible}
      onCancel={onClose}
      onOk={handleFormSubmit}
    >
      <Form form={form} layout="vertical">
        <Form.Item label="Nom" name="nom" rules={[{ required: true, message: 'Champ obligatoire' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Prix Hospitalier" name="prix_hospitalier" rules={[{ required: true, message: 'Champ obligatoire' }]}>
          <InputNumber />
        </Form.Item>
        <Form.Item label="Tarif" name="tarif" rules={[{ required: true, message: 'Champ obligatoire' }]}>
          <InputNumber />
        </Form.Item>
        <Form.Item label="Denomination" name="denomination" rules={[{ required: true, message: 'Champ obligatoire' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Prix Public" name="prix_public" rules={[{ required: true, message: 'Champ obligatoire' }]}>
          <InputNumber />
        </Form.Item>
        <Form.Item label="Nombre de Boites" name="nombre_de_boites" rules={[{ required: true, message: 'Champ obligatoire' }]}>
          <InputNumber />
        </Form.Item>
        <Form.Item label="Etat" name="etat" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateMedicamentModal;
