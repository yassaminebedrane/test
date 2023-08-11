import axios from "axios"

const medicamentsApi = axios.create({
    baseURL: "http://localhost:3500"
})

export const getMedicaments = async () => {
    const response = await medicamentsApi.get("/medicaments")
    return response.data
}

export const addMedicament = async (medicament) => {
    return await medicamentsApi.post("/medicaments", medicament)
}

export const updateMedicament = async (medicament) => {
    return await medicamentsApi.patch(`/medicaments/${medicament.id}`, medicament)
}

export const deleteMedicament = async ({ id }) => {
    return await medicamentsApi.delete(`/medicaments/${id}`, id)
}

export default medicamentsApi