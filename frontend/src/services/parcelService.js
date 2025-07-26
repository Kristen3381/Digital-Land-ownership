import api from '../config/api';

// Coordinates with Backend: POST /api/parcels
// Frontend sends FormData with stringified ownerDetails & geometry, and File objects for documents
export const createParcel = async (formData) => {
  const response = await api.post('/parcels', formData, {
    headers: {
      'Content-Type': 'multipart/form-data', // Axios sets this automatically for FormData
    },
  });
  // Backend returns: { message, parcel: { ... } }
  return response.data;
};

// Coordinates with Backend: GET /api/parcels (with optional query params)
export const getAllParcels = async (params = {}) => {
  const response = await api.get('/parcels', { params });
  // Backend returns: Array of parcel objects, with registeredBy populated
  return response.data;
};

// Coordinates with Backend: GET /api/parcels/:id
export const getParcelById = async (parcelId) => {
  const response = await api.get(`/parcels/${parcelId}`);
  // Backend returns: Single parcel object, with registeredBy populated
  return response.data;
};

// Coordinates with Backend: PUT /api/parcels/:id
// Frontend sends JSON body with fields to update
export const updateParcel = async (parcelId, updateData) => {
  const response = await api.put(`/parcels/${parcelId}`, updateData);
  // Backend returns: { message, parcel: { ... } }
  return response.data;
};

// Coordinates with Backend: DELETE /api/parcels/:id
export const deleteParcel = async (parcelId) => {
  const response = await api.delete(`/parcels/${parcelId}`);
  // Backend returns: { message }
  return response.data;
};

// Coordinates with Backend: POST /api/parcels/:id/documents
// Frontend sends FormData with 'new_documents' field containing File objects
export const addDocumentsToParcel = async (parcelId, formData) => {
  const response = await api.post(`/parcels/${parcelId}/documents`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  // Backend returns: { message, parcel: { ... } }
  return response.data;
};

// Coordinates with Backend: GET /api/parcels/spatial/within-bbox
export const getParcelsInBbox = async (bboxParams) => {
  const response = await api.get('/parcels/spatial/within-bbox', { params: bboxParams });
  // Backend returns: Array of parcel objects
  return response.data;
};