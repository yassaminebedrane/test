import api from './apiService'


export const getBaremes = async () => {
    const response = await api.get(`/baremes`);
    return response.data;
};

export const getCodeActes = async () => {
    const response = await api.get(`/code_actes`);
    return response.data;
};

export const getCodeSousActes = async () => {
    const response = await api.get(`/code_sous_actes`);
    return response.data;
};

export const getCodeSousActesByCodeActe = async (codeActeId) => {
    const response = await api.get(`/code_sous_actes`, {
        params: { code_acte: codeActeId }
    });
    return response.data;
};

export const getCodeActeById = async (id) => {
    const response = await api.get(`/code_actes/${id}`);
return response.data;
};


export const getCodeSousActeById = async (id) => {
    const response = await api.get(`/code_sous_actes/${id}`);
    return response.data;
};

export const getCodeTypePrestataireById = async (id) => {
    const response = await api.get(`/type_prestataires/${id}`);
    return response.data;
};



export const getCodeTypePrestataires = async () => {
    const response = await api.get(`/type_prestataires`);
    return response.data;
};

export const getNatures = async () => {
    const response = await api.get(`/natures`);
    return response.data;
};

export const searchBaremesByType = async (type) => {
    try {
        const response = await api.get(`/baremes`, {
            params: { type_bareme: type },
        });
        return response.data;
    } catch (error) {
        console.error('Error searching baremes:', error);
        throw error;
    }
};


export const addBareme = async (bareme) => {
    return await api.post("/baremes", bareme)
}

export const updateBareme = async (bareme) => {
    return await api.patch(`/baremes/${bareme.id}`, bareme)
}


export const filterBaremes = async (type, codeActe) => {
    try {
        let query = `/baremes`;

        if (type !== null && codeActe !== null) {
            query += `?type_bareme=${type}&code_acte=${codeActe}`;
        } else if (type !== null) {
            query += `?type_bareme=${type}`;
        } else if (codeActe !== null) {
            query += `?code_acte=${codeActe}`;}
        else {
            return [];
        }

        const response = await api.get(query);
        return response.data;
    } catch (error) {
        throw error;
    }
};

