import { useState, useEffect } from 'react';
import { materialService } from '../services/materialService';

export const useMaterials = (subjectId, filterType = 'All', topicId = null) => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const data = materialService.getMaterialsBySubject(subjectId, filterType, topicId);
    setMaterials(data);
    setLoading(false);
  }, [subjectId, filterType, topicId]);

  const uploadMaterial = (materialData) => {
    const newMat = materialService.uploadMaterial({ ...materialData, subjectId });
    setMaterials(prev => [newMat, ...prev]);
    return newMat;
  };

  const search = (query) => {
    const results = materialService.searchMaterials(subjectId, query);
    setMaterials(results);
  };

  return {
    materials,
    loading,
    uploadMaterial,
    search
  };
};

export default useMaterials;
