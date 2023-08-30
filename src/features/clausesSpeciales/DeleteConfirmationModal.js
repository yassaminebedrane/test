import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { updateBareme } from '../../api/baremesApi';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Modal } from 'antd';
import { deleteClauseSpeciale } from '../../api/clausesSpecialesApi';


const DeleteConfirmationModal = ({ isVisible, onClose, onCancel, clause }) => {

    const queryClient = useQueryClient();


    const deleteClauseSpecialeMutation = useMutation(deleteClauseSpeciale, {
        onSuccess: () => {
            queryClient.invalidateQueries('clausesSpeciales');
            onClose();
        }
    });


    const showToastMessage = () => {
        toast.success('Clause supprimée avec succès', {
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
            await deleteClauseSpecialeMutation.mutateAsync(clause);
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
            Êtes-vous sûr(e) de vouloir supprimer cette clause?
        </Modal>
    );








};

export default DeleteConfirmationModal;
