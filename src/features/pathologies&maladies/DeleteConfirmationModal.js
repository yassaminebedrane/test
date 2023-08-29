import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { updateBareme } from '../../api/baremesApi';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Modal } from 'antd';
import { deletePathologie, updateMaladie } from '../../api/pathologiesApi';


const DeleteConfirmationModal = ({ isVisible, onClose, onCancel, toDelete, type }) => {
    console.log("toDelete", toDelete, "type",type)
    const queryClient = useQueryClient();


    const deletePathologieMutation = useMutation(deletePathologie, {
        onSuccess: () => {
            queryClient.invalidateQueries('pathologies');
            onClose();
        }
    });

    const updateMaladieMutation = useMutation(updateMaladie, {
        onSuccess: () => {
            queryClient.invalidateQueries('maladies');
            onClose();
        }
    });

    if (type == "pathologie") {


        const showToastMessage = () => {
            toast.success('Pathologie supprimée avec succès', {
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
                console.log(toDelete)
                await deletePathologieMutation.mutateAsync(toDelete);
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
                Êtes-vous sûr(e) de vouloir supprimer cette pathologie?
            </Modal>
        );

    } else if (type == "maladie") {


        const showToastMessage = () => {
            toast.success('Maladie supprimée avec succès', {
                position: toast.POSITION.TOP_CENTER,
                transition: Slide,
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
            });
        };


        const handleConfirm = async () => {
            const updatedMaladie = {
                ...toDelete,
                etat: 1
            };
        
            try {
                await updateMaladieMutation.mutateAsync(updatedMaladie);
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
                Êtes-vous sûr(e) de vouloir supprimer cette maladie?
            </Modal>
        );
    }


};

export default DeleteConfirmationModal;
