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
};


export const addMaladie = async (maladie) => {
    return await api.post("/maladies", maladie)
};


export const updatePathologie = async (pathologie) => {
    return await api.patch(`/pathologies/${pathologie.id}`, pathologie)
}

export const deletePathologie = async (pathologie) => {
    console.log("Pathologie to delete", pathologie);
    try {
      const relatedMaladies = await api.get(`/maladies`, {
        params: {
          pathologie_id: pathologie.id,
        },
      });
      console.log("Related Maladies", relatedMaladies.data);
  
      for (const maladie of relatedMaladies.data) {
        console.log("Maladie ID", maladie.id);
        await deleteMaladie(maladie);
      }
  
      await api.delete(`/pathologies/${pathologie.id}`);
      console.log(`Pathologie with ID ${pathologie.id} deleted, along with its related Maladies.`);
    } catch (error) {
      console.error(`Error deleting Pathologie with ID ${pathologie.id} and related Maladies:`, error);
      throw error;
    }
  };
  

export const updateMaladie = async (maladie) => {
    await api.put(`/maladies/${maladie.id}`,maladie);
}

export const filterPathologies = async (type) => {
    try {
        let query = `/pathologies`;

       if (type !== null) {
            query += `?type=${type}`;
        }else {
            return [];
        }

        const response = await api.get(query);
        return response.data;
    } catch (error) {
        throw error;
    }
};



export const deleteMaladie = async (maladie) => {
    return await api.delete(`/maladies/${maladie.id}`, maladie)
}
