import { apiDelete, apiGet, apiPost, apiPut } from "./api";

const createCrudService = (basePath) => ({
  getAll: () => apiGet(basePath),
  getById: (id) => apiGet(`${basePath}/${id}`),
  create: (payload, isFormData = false) => apiPost(basePath, payload, isFormData),
  update: (id, payload, isFormData = false) => apiPut(`${basePath}/${id}`, payload, isFormData),
  remove: (id) => apiDelete(`${basePath}/${id}`),
});

export const subjectService = createCrudService("/subjects");
export const departmentService = createCrudService("/departments");
export const laboratoryService = createCrudService("/laboratories");
export const equipmentService = createCrudService("/equipment");
export const roleService = createCrudService("/roles");
export const userService = createCrudService("/users");
