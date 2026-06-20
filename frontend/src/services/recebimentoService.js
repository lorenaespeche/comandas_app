import api from './api';
import { API_ENDPOINTS } from '../config/apiConfig';

const { RECEBIMENTO } = API_ENDPOINTS;

const recebimentoService = {
    // Dashboard - todas as comandas abertas
    dashboard: async () => {
        const response = await api.get(RECEBIMENTO.DASHBOARD);
        return response.data;
    },

    // Detalhar comandas selecionadas (ids = array de números)
    detalhar: async (ids) => {
        const idsStr = Array.isArray(ids) ? ids.join(',') : ids;
        const url = RECEBIMENTO.DETALHE.replace(':ids', idsStr);
        const response = await api.get(url);
        return response.data;
    },

    // Processar recebimento completo
    processar: async (dados) => {
        const response = await api.post(RECEBIMENTO.RECEBER, dados);
        return response.data;
    },

    // Buscar comprovante pelo id do recebimento
    comprovante: async (recebimentoId) => {
        const url = RECEBIMENTO.COMPROVANTE.replace(':id', recebimentoId);
        const response = await api.get(url);
        return response.data;
    },

    // Listar todos os recebimentos
    listar: async (params = {}) => {
        const response = await api.get(RECEBIMENTO.LIST || '/recebimento/');
        return response.data;
    },

    // Buscar por ID
    getById: async (id) => {
        const url = (RECEBIMENTO.GET || '/recebimento/:id').replace(':id', id);
        const response = await api.get(url);
        return response.data;
    },

    // Deletar recebimento
    deletar: async (id) => {
        const url = (RECEBIMENTO.DELETE || '/recebimento/:id').replace(':id', id);
        const response = await api.delete(url);
        return response.data;
    },
};

export default recebimentoService;
