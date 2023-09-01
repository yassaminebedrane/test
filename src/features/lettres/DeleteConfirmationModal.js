import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { updateBareme } from '../../api/baremesApi';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Modal } from 'antd';
import { deleteLettre } from '../../api/lettresApi';


const DeleteConfirmationModal = ({ isVisible, onClose, onCancel, lettre }) => {

    const queryClient = useQueryClient();


    const deleteLettreMutation = useMutation(deleteLettre, {
        onSuccess: () => {
            queryClient.invalidateQueries('lettres');
            onClose();
        }
    });


    const showToastMessage = () => {
        toast.success('Lettre supprimée avec succès', {
            position: toast.POSITION.TOP_CENTER,
            transition: Slide,
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
        });
    };


    const handleConfirm = async () => {
        try {
            await deleteLettreMutation.mutateAsync(lettre);
            showToastMessage();
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
            Êtes-vous sûr(e) de vouloir supprimer cette lettre?
        </Modal>
    );








};

export default DeleteConfirmationModal;
