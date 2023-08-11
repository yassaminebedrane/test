import React, { useState } from 'react';
import { getMedicaments, addMedicament, updateMedicament, deleteMedicament } from '../../api/medicamentsApi';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Modal } from 'antd';

const DeleteConfirmationModal = ({ isVisible, onClose, onCancel, medicament }) => {
    const queryClient = useQueryClient();
    const deleteMedicamentMutation = useMutation(deleteMedicament, {
        onSuccess: () => {
            queryClient.invalidateQueries('medicaments');
            showToastMessage();
            onClose(); // Close the modal after successful deletion
        }
    });

    const showToastMessage = () => {
        toast.success('Medicament deleted successfully!', {
            position: toast.POSITION.TOP_CENTER
        });
    };

    const medicamentName = medicament ? medicament.nom : '';


    return (
        <Modal
            title="Confirmation"
            visible={isVisible}
            onCancel={onCancel} 
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Annuler
                </Button>,
                <Button
                    key="confirm"
                    type="danger"
                    onClick={() => deleteMedicamentMutation.mutate({ id: medicament.id })}
                    >
                    Confirmer
                </Button>,
            ]}
        >
            Etes vous sures de vouloir supprimer {medicamentName}?
        </Modal>
    );
};

export default DeleteConfirmationModal;
