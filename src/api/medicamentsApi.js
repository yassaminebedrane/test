import api from './apiService'

export const getMedicaments = async () => {
    const response = await api.get("/medicaments")
    return response.data
}

export const addMedicament = async (medicament) => {
    return await api.post("/medicaments", medicament)
}

export const updateMedicament = async (medicament) => {
    return await api.patch(`/medicaments/${medicament.id}`, medicament)
}

export const deleteMedicament = async ({ id }) => {
    return await api.delete(`/medicaments/${id}`, id)
}
