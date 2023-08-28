import api from './apiService'


export const getPathologies = async () => {
    const response = await api.get(`/pathologies`);
    return response.data;
};

export const getMaladiesByPathologieId = async (pathologieId) => {
    const response = await api.get(`/maladies`, {
        params: { pathologie_id: pathologieId }
    });
    return response.data;
};

export const addPathologie = async (pathologie) => {
    return await api.post("/pathologies", pathologie)
}