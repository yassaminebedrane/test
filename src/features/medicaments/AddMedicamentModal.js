import React, { useState } from 'react';
import { Modal, Form, Input, Switch } from 'antd';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getMedicaments, addMedicament, updateMedicament, deleteMedicament } from '../../api/medicamentsApi';
import { ToastContainer, toast,Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const AddMedicamentModal = ({ isVisible, onClose, onSubmit }) => {

    const [form] = Form.useForm();
    const [nom, setNom] = useState("");
    const [prixHospitalier, setPrixHospitalier] = useState(0);
    const [tarif, setTarif] = useState(0);
    const [denomination, setDenomination] = useState("");
    const [prixPublic, setPrixPublic] = useState(0);
    const [nombreDeBoites, setNombreDeBoites] = useState(0);

    const queryClient = useQueryClient();

    const addMedicamentMutation = useMutation(addMedicament, {
        onSuccess: () => {
            queryClient.invalidateQueries('medicaments');
        }
    });

    const handleFormSubmit = async () => {
        try {
            const values = await form.validateFields();
            
            const newMedicament = {
                ...values,
                etat: true
            };
    
            await addMedicamentMutation.mutateAsync(newMedicament);
            form.resetFields();
            onClose();
            showToastMessage();
    
        } catch (error) {
            console.error('Form validation error:', error);
        }
    };
    
    

    const showToastMessage = () => {
        toast.success('Medicament ajouté avec succès', {
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
            title="Ajouter un nouveau médicament"
            visible={isVisible}
            onCancel={handleCancel}
            onOk={handleFormSubmit}
            okText="Confirmer" 
            cancelText="Annuler"
            okButtonProps={{ 
                style: { backgroundColor: '#02A676', borderColor: '#02A676' },
                
            }}
           
        >
            <Form form={form} layout="vertical">
                <Form.Item label="Nom" name="nom" rules={[{ required: true, message: 'Champ obligatoire' }]}>
                    <Input
                        id="nom"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                    />
                </Form.Item>
                <Form.Item label="Prix Hospitalier" name="prix_hospitalier" rules={[{ required: true, message: 'Champ obligatoire' }]}>
                    <Input
                        type="number"
                        id="prix_hospitalier"
                        value={prixHospitalier}
                        onChange={(e) => setPrixHospitalier(e.target.value)}
                    />
                </Form.Item>
                <Form.Item label="Tarif" name="tarif" rules={[{ required: true, message: 'Champ obligatoire' }]}>
                    <Input
                        type="number"
                        id="tarif"
                        value={tarif}
                        onChange={(e) => setTarif(e.target.value)}
                    />
                </Form.Item>
                <Form.Item label="Denomination" name="denomination" rules={[{ required: true, message: 'Champ obligatoire' }]}>
                    <Input
                        id="denomination"
                        value={denomination}
                        onChange={(e) => setDenomination(e.target.value)}
                    />
                </Form.Item>
                <Form.Item label="Prix Public" name="prix_public" rules={[{ required: true, message: 'Champ obligatoire' }]}>
                    <Input
                        type="number"
                        id="prix_public"
                        value={prixPublic}
                        onChange={(e) => setPrixPublic(e.target.value)}
                    />
                </Form.Item>
                <Form.Item label="Nombre de Boites" name="nombre_de_boites" rules={[{ required: true, message: 'Champ obligatoire' }]}>
                    <Input
                        type="number"
                        id="nombre_de_boites"
                        value={nombreDeBoites}
                        onChange={(e) => setNombreDeBoites(e.target.value)}
                    />
                </Form.Item>
            </Form>

        </Modal>
    );
};

export default AddMedicamentModal;
