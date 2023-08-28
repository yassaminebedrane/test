import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { updateBareme } from '../../api/baremesApi';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Modal } from 'antd';
import { deleteCodeActe, deleteCodeSousActe } from '../../api/codesActes&SousActesApi';


const DeleteConfirmationModal = ({ isVisible, onClose, onCancel, code, type }) => {
    console.log("code", code, "type",type)
    const queryClient = useQueryClient();
    const deleteActeMutation = useMutation(deleteCodeActe, {
        onSuccess: () => {
            queryClient.invalidateQueries('codeActes');
            onClose();
        }
    });
    const deleteCodeSousActeMutation = useMutation(deleteCodeSousActe, {
        onSuccess: () => {
            queryClient.invalidateQueries('codeSousActes');
            onClose();
        }
    });

    if (type == "acte") {


        const showToastMessage = () => {
            toast.success('Code acte supprimé avec succès', {
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
                console.log(code)
                await deleteActeMutation.mutateAsync(code);
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
                Êtes-vous sûr(e) de vouloir supprimer ce code acte?
            </Modal>
        );

    } else if (type == "sousActe") {


        const showToastMessage = () => {
            toast.success('Code sous acte supprimé avec succès', {
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
                console.log(code)
                await deleteCodeSousActeMutation.mutateAsync(code);
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
                Êtes-vous sûr(e) de vouloir supprimer ce code sous acte?
            </Modal>
        );
    }







};

export default DeleteConfirmationModal;
