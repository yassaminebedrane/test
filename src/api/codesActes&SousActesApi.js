import api from './apiService'


export const getCodeActes = async () => {
    const response = await api.get(`/code_actes`);
    return response.data;
}

export const addCodeActe = async (codeActe) => {
    return await api.post("/code_actes", codeActe)
}

export const updateCodeActe = async (codeActe) => {
    return await api.patch(`/code_actes/${codeActe.id}`, codeActe)
}

export const deleteCodeActe = async (codeActe) => {
    console.log("code acte to delete", codeActe)
    try {
        const relatedCodeSousActes = await api.get(`/code_sous_actes`, {
            params: {
                code_acte: codeActe.id,
            },
        });
        console.log("search result",relatedCodeSousActes.data)

        for (const codeSousActe of relatedCodeSousActes.data) {
            console.log("id sous acte",codeSousActe.id)
            await deleteCodeSousActe(codeSousActe);
        }

        await api.delete(`/code_actes/${codeActe.id}`);
        console.log(`Code Acte with ID ${codeActe.id} deleted, along with its related Code Sous Actes.`);
    } catch (error) {
        console.error(`Error deleting Code Acte with ID ${codeActe.id} and related Code Sous Actes:`, error);
        throw error; 
    }
}


export const addCodeSousActe = async (codeSousActe) => {
    return await api.post("/code_sous_actes", codeSousActe)
}

export const updateCodeSousActe = async (codeSousActe) => {
    return await api.patch(`/code_sous_actes/${codeSousActe.id}`, codeSousActe)
}

export const deleteCodeSousActe = async (codeSousActe) => {
    return await api.delete(`/code_sous_actes/${codeSousActe.id}`, codeSousActe)
}