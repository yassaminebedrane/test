import api from './apiService'

export const getLettres = async () => {
    const response = await api.get("/lettres")
    return response.data
}

export const addLettre = async (lettre) => {
    return await api.post("/lettres", lettre)
}

export const updateLettre = async (lettre) => {
    return await api.patch(`/lettres/${lettre.id}`, lettre)
}

export const deleteLettre = async ({ id }) => {
    return await api.delete(`/lettres/${id}`, id)
}

export const getTypeCorrespondanceById = async ({ id }) => {
    const response = await api.get(`/type_correspondance/${id}`,id);
return response.data;
};

export const getTypesCorrespondances = async () => {
    const response = await api.get("/type_correspondance")
    return response.data
};

export const filterLettres = async (type) => {
    try {
        let query = `/lettres`;

       if (type !== null) {
            query += `?type_correspondance_id=${type}`;
        }
        const response = await api.get(query);
        console.log(response.data)
        return response.data;
    } catch (error) {
        throw error;
    }
};