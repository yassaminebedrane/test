import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { updateMedicament } from '../../api/medicamentsApi';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Modal } from 'antd';

const DeleteConfirmationModal = ({ isVisible, onClose, onCancel, medicament }) => {
    const queryClient = useQueryClient();

    const updateMedicamentMutation = useMutation(updateMedicament, {
        onSuccess: () => {
            queryClient.invalidateQueries('medicaments');
            showToastMessage();
            onClose();
        }
    });

    const showToastMessage = () => {
        toast.success('Medicament supprimé avec succès', {
            position: toast.POSITION.TOP_CENTER,
            transition: Slide,
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
        });
    };

    const medicamentName = medicament ? medicament.nom : '';

    const handleConfirm = async () => {
        const updatedMedicament = {
            ...medicament,
            etat: false
        };

        await updateMedicamentMutation.mutateAsync(updatedMedicament);
    };

    return (
        <Modal
            title="Confirmation"
            open={isVisible}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Annuler
                </Button>,
                <Button
                    style={{ backgroundColor: 'red', color: 'white' }}
                    key="confirm"
                    onClick={handleConfirm}
                >
                    Confirmer
                </Button>,
            ]}
        >
            Êtes-vous sûr(e) de vouloir supprimer {medicamentName}?
        </Modal>
    );
};

export default DeleteConfirmationModal;
