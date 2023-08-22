import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Switch, DatePicker, Button, Select } from 'antd';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { ToastContainer, toast, Slide } from 'react-toastify';
import { updateBareme, getCodeActes, getCodeSousActesByCodeActe, getCodeTypePrestataires, getNatures, getCodeActeById, getCodeSousActeById } from '../../api/baremesApi';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import 'moment/locale/fr';


const UpdateBaremeModal = ({ isVisible, onClose, onSubmit, initialData }) => {

    const [form] = Form.useForm();
    const [codeActes, setCodeActes] = useState([]);
    const [codeSousActes, setCodeSousActes] = useState([]);
    const [selectedCodeActe, setSelectedCodeActe] = useState(null);
    const [selectedType, setSelectedType] = useState('');
    const [codeTypePrestataires, setCodeTypePrestataires] = useState([]);
    const [natures, setNatures] = useState([]);

    const [selectedCodeSousActe, setSelectedCodeSousActe] = useState(null);

    const [codeActeLibelle, setCodeActeLibelle] = useState('');
    const [codeSousActeLibelle, setCodeSousActeLibelle] = useState('');


    const { Option } = Select;

    const queryClient = useQueryClient();
    const typeBareme = [
        'FMSAR', 'AMO', 'CNOPS', 'WAFA1',
        'HP0', 'CHU',
        'HP', 'CHUCNOPS', 'HPCNOPS',
        'SECTMUT',
    ];
    useEffect(() => {
        if (initialData) {
            async function fetchLibelleValues() {
                const codeActeResponse = await getCodeActeById(initialData.code_acte);
                // const codeSousActeResponse = await getCodeSousActeById(
                //     initialData.code_sous_acte
                // );

                // setCodeActeLibelle(codeActeResponse.libelle);
                // setCodeSousActeLibelle(codeSousActeResponse.libelle);
                // setSelectedCodeActe(codeSousActeResponse.libelle)

                form.setFieldsValue({
                    code_acte: initialData.code_acte,
                    // code_sous_acte: initialData.code_sous_acte,
                    type_bareme: initialData.type_bareme,
                    type_tarif: initialData.type_tarif,
                    type_lette: initialData.type_lette,
                    montant: initialData.montant,
                    taux_remboursement: initialData.taux_remboursement,
                    taux_remboursement_public: initialData.taux_remboursement_public,
                    plafond: initialData.plafond,
                    periode: initialData.periode,
                    cotation: initialData.cotation,
                    code_type_prestataire: initialData.code_type_prestataire,
                    nature: initialData.nature,
                    date_debut: moment(initialData.date_debut),
                    etat: initialData.etat,
                });
            }

            fetchLibelleValues();
        }
    }, [isVisible, initialData, form]);



    useEffect(() => {
        async function fetchCodeActes() {
            try {
                const data = await getCodeActes();
                setCodeActes(data);
            } catch (error) {
                console.error('Error fetching code actes:', error);
            }
        }
        fetchCodeActes();
    }, []);

    useEffect(() => {
        async function fetchCodeSousActes() {
            if (selectedCodeActe) {
                try {
                    const data = await getCodeSousActesByCodeActe(selectedCodeActe);
                    setCodeSousActes(data);
                } catch (error) {
                    console.error('Error fetching code sous actes:', error);
                }
            } else {
                setCodeSousActes([]);
            }
        }
        fetchCodeSousActes();
    }, [selectedCodeActe]);

    const handleCodeActeSelect = (value) => {
        console.log(value)
        setSelectedCodeActe(value);
        setSelectedCodeSousActe(null);
    };

    useEffect(() => {
        fetchCodeTypePrestataires();
        fetchNatures();
    }, []);

    const fetchCodeTypePrestataires = async () => {
        const data = await getCodeTypePrestataires();
        setCodeTypePrestataires(data);
    };

    const fetchNatures = async () => {
        const data = await getNatures();
        setNatures(data);
    };

    const handleFormSubmit = async () => {
        try {
            const values = await form.validateFields();
            const updatedBareme = { ...initialData, ...values };

            if (!areObjectsEqual(updatedBareme, initialData)) {
                const newBareme = {
                    ...updatedBareme,
                    etat: initialData.etat
                };
                await updateBaremeMutation.mutateAsync(newBareme);
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


    const updateBaremeMutation = useMutation(updateBareme, {
        onSuccess: () => {
            queryClient.invalidateQueries('baremes');
        }
    });


    const showToastMessage = () => {
        toast.success('Bareme modifié avec succès', {
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
            title="Modifier le barème"
            open={isVisible}
            onCancel={handleCancel}
            onOk={handleFormSubmit}
            okText="Confirmer"
            cancelText="Annuler"
            okButtonProps={{
                style: { backgroundColor: '#02A676', borderColor: '#02A676' },

            }}

        >
            <Form form={form} layout="vertical" >

                <Form.Item name="type_bareme" label="Type Barème" rules={[{ required: true }]}>
                    <Select
                        placeholder="Type barème"
                    >
                        {typeBareme && typeBareme.map((value, index) => (
                            <Option key={index} value={value}>
                                {value}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>


                <Form.Item name="code_acte" label="Code Acte" rules={[{ required: true }]}>
                    <Select
                        placeholder="Select a Code Acte"
                        onChange={handleCodeActeSelect}
                        value={selectedCodeActe}
                    >
                        {codeActes.map((codeActe) => (
                            <Option key={codeActe.id} value={codeActe.id}>
                                {codeActe.libelle}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item name="code_sous_acte" label="Code Sous Acte" rules={[{ required: true }]}>
                    <Select
                        placeholder="Select a Code Sous Acte"
                        value={selectedCodeSousActe}
                        onChange={(value) => setSelectedCodeSousActe(value)}
                    >
                        {codeSousActes.map((codeSousActe) => (
                            <Option key={codeSousActe.id} value={codeSousActe.id}>
                                {codeSousActe.libelle}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

            <Form.Item name="type_tarif" label="Type Tarif" rules={[{ required: true }]}>
                <Select placeholder="Select a Type Tarif">
                    <Option value="P">Forfaitaire</Option>
                    <Option value="U">Unitaire</Option>
                </Select>
            </Form.Item>


            <Form.Item name="type_lette" label="Type Lettre" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item name="montant" label="Montant" rules={[{ required: true }]}>
                <Input type="number" />
            </Form.Item>
            <Form.Item name="taux_remboursement" label="Taux Remboursement" rules={[{ required: true }]}>
                <Input type="number" />
            </Form.Item>
            <Form.Item name="taux_remboursement_public" label="Taux Remboursement Public" rules={[{ required: true }]}>
                <Input type="number" />
            </Form.Item>
            <Form.Item name="plafond" label="Plafond" rules={[{ required: true }]}>
                <Input type="number" />
            </Form.Item>
            <Form.Item name="periode" label="Période" rules={[{ required: true }]}>
                <Input type="number" />
            </Form.Item>
            <Form.Item name="cotation" label="Cotation" rules={[{ required: true }]}>
                <Input type="number" />
            </Form.Item>
            <Form.Item name="code_type_prestataire" label="Code Type Prestataire" rules={[{ required: true }]}>
                <Select placeholder="Select a Code Type Prestataire">
                    {codeTypePrestataires.map((item) => (
                        <Option key={item.id} value={item.id}>
                            {item.libelle}
                        </Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item name="nature" label="Nature" rules={[{ required: true }]}>
                <Select placeholder="Select a Nature">
                    {natures.map((item) => (
                        <Option key={item.id} value={item.id}>
                            {item.libelle}
                        </Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item name="date_debut" label="Date Début" rules={[{ required: true }]}>
                <DatePicker />
            </Form.Item>


        </Form>

        </Modal >
    );
};

export default UpdateBaremeModal;
