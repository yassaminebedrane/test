import api from './apiService'

export const getClausesSpeciales = async () => {
    const response = await api.get("/clauses_speciales")
    return response.data
}

export const addClauseSpeciale = async (clauseSpeciale) => {
    return await api.post("/clauses_speciales", clauseSpeciale)
}

export const updateClauseSpeciale = async (clauseSpeciale) => {
    return await api.patch(`/clauses_speciales/${clauseSpeciale.id}`, clauseSpeciale)
}

export const deleteClauseSpeciale = async ({ id }) => {
    return await api.delete(`/clauses_speciales/${id}`, id)
}
