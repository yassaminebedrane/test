import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { updateBareme } from '../../api/baremesApi';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Modal } from 'antd';

const DeleteConfirmationModal = ({ isVisible, onClose, onCancel, bareme }) => {
    const queryClient = useQueryClient();

    const updateBaremeMutation = useMutation(updateBareme, {
        onSuccess: () => {
            queryClient.invalidateQueries('baremes');
            showToastMessage();
            onClose();
        }
    });

    const showToastMessage = () => {
        toast.success('Bareme supprimé avec succès', {
            position: toast.POSITION.TOP_CENTER,
            transition: Slide,
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
        });
    };


    const handleConfirm = async () => {
        const updatedBareme = {
            ...bareme,
            etat: 1
        };
    
        try {
            await updateBaremeMutation.mutateAsync(updatedBareme);
        } catch (error) {
            console.log(error)
        }
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
            Êtes-vous sûr(e) de vouloir supprimer ce bareme?
        </Modal>
    );
};

export default DeleteConfirmationModal;
