import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Switch } from 'antd';
import { getMedicaments, addMedicament, updateMedicament, deleteMedicament } from '../../api/medicamentsApi';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { ToastContainer, toast,Slide,Zoom } from 'react-toastify';
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
      });
    }
  }, [isVisible, initialData]);

  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();
      const updatedMedicament = { ...initialData, ...values };
      
      if (!areObjectsEqual(updatedMedicament, initialData)) {
        const newMedicament = {
          ...updatedMedicament,
          etat: initialData.etat
      };
        await updateMedicamentMutation.mutateAsync(newMedicament);
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
  

  const updateMedicamentMutation = useMutation(updateMedicament, {
    onSuccess: () => {
      queryClient.invalidateQueries('medicaments');
    }
  });


  const showToastMessage = () => {
    toast.success('Medicament modifié avec succès', {
      position: toast.POSITION.TOP_CENTER,
      transition: Slide,
      autoClose: 3000,
      hideProgressBar: true, 
      closeOnClick: true, 
      pauseOnHover: true, 
    });
  };

  return (
    <Modal
      title="Modifier le médicament"
      open={isVisible}
      onCancel={onClose}
      onOk={handleFormSubmit}
      okText="Confirmer"
      cancelText="Annuler"
      okButtonProps={{
        style: { backgroundColor: '#02A676', borderColor: '#02A676' },

      }}
    >
      <Form form={form} layout="vertical" >
        <Form.Item label="Nom" name="nom" rules={[{ required: true, message: 'Champ obligatoire' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Prix Hospitalier" name="prix_hospitalier" rules={[{ required: true, message: 'Champ obligatoire' }]}>
          <Input
          type="number" />
        </Form.Item>
        <Form.Item label="Tarif" name="tarif" rules={[{ required: true, message: 'Champ obligatoire' }]}>
        <Input
          type="number" />
        </Form.Item>
        <Form.Item label="Denomination" name="denomination" rules={[{ required: true, message: 'Champ obligatoire' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Prix Public" name="prix_public" rules={[{ required: true, message: 'Champ obligatoire' }]}>
        <Input
          type="number" />
        </Form.Item>
        <Form.Item label="Nombre de Boites" name="nombre_de_boites" rules={[{ required: true, message: 'Champ obligatoire' }]}>
        <Input
          type="number" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateMedicamentModal;
