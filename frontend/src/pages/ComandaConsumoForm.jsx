import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

import {
    TextField, Button, Box, CircularProgress, Typography,
    MenuItem, FormControl, InputLabel, Select,
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Alert
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';

import PageLayout from "../components/common/PageLayout";
import ActionButtons from '../components/common/ActionButtons';
import { useValidationRules } from '../hooks/useValidationRules';
import comandaService from '../services/comandaService';
import produtoService from '../services/produtoService';
import showSnackbar from '../utils/snackbar';
import showConfirm from '../utils/confirm';
import { useAuth } from '../context/AuthContext';

const ComandaConsumoForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const { control, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
        defaultValues: { produto_id: '', quantidade: 1 }
    });

    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [comanda, setComanda] = useState(null);
    const [itens, setItens] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [editingItemId, setEditingItemId] = useState(null);

    const validationRules = useValidationRules();

    const produtoSelecionadoId = watch('produto_id');

    useEffect(() => {
        if (id) loadData();
    }, [id]);

    const loadData = async () => {
        try {
            setLoadingData(true);
            const [comandaData, itensData, produtosResp] = await Promise.all([
                comandaService.getById(id),
                comandaService.listItems(id),
                produtoService.list({ limit: 1000 })
            ]);
            setComanda(comandaData);
            setItens(itensData);
            const lista = Array.isArray(produtosResp) ? produtosResp : (produtosResp?.data || []);
            setProdutos(lista);
        } catch (error) {
            showSnackbar(error.apiMessage || 'Erro ao carregar dados da comanda', 'error');
        } finally {
            setLoadingData(false);
        }
    };

    const recarregarItens = async () => {
        try {
            const itensData = await comandaService.listItems(id);
            setItens(itensData);
        } catch (e) {
            showSnackbar('Erro ao recarregar itens', 'error');
        }
    };

    const onSubmit = async (data) => {
        // Garantir funcionario_id — obrigatório
        const funcionarioId = user?.id;
        if (!funcionarioId) {
            showSnackbar('Sessão expirada. Faça login novamente.', 'error');
            return;
        }

        const produtoId = parseInt(data.produto_id);
        const produto = produtos.find(p => p.id === produtoId);
        if (!produto) {
            showSnackbar('Produto não encontrado', 'error');
            return;
        }

        const itemData = {
            produto_id: produtoId,
            quantidade: parseInt(data.quantidade),
            funcionario_id: funcionarioId,
            valor_unitario: parseFloat(produto.valor_unitario)
        };

        setLoading(true);
        try {
            if (editingItemId) {
                await comandaService.updateItem(editingItemId, {
                    quantidade: itemData.quantidade,
                    valor_unitario: itemData.valor_unitario
                });
                showSnackbar('Item atualizado com sucesso!', 'success');
                setEditingItemId(null);
            } else {
                await comandaService.addItem(id, itemData);
                showSnackbar('Item adicionado com sucesso!', 'success');
            }

            reset({ produto_id: '', quantidade: 1 });
            await recarregarItens();
        } catch (error) {
            showSnackbar(error.apiMessage || 'Erro ao salvar item', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleEditItem = (item) => {
        setEditingItemId(item.id);
        setValue('produto_id', item.produto_id);
        setValue('quantidade', item.quantidade);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingItemId(null);
        reset({ produto_id: '', quantidade: 1 });
    };

    const handleRemoveItem = (item) => {
        const nome = item.produto?.nome ||
            produtos.find(p => p.id === item.produto_id)?.nome || 'Produto';
        showConfirm('Remover Item',
            `Tem certeza que deseja remover "${nome}", quantidade ${item.quantidade}?`,
            async () => {
                try {
                    await comandaService.removeItem(item.id);
                    showSnackbar('Item removido com sucesso!', 'success');
                    await recarregarItens();
                } catch (error) {
                    showSnackbar(error.apiMessage || 'Erro ao remover item', 'error');
                }
            }
        );
    };

    if (loadingData) {
        return (
            <PageLayout title={`Consumo - Comanda ${id}`}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                    <CircularProgress />
                </Box>
            </PageLayout>
        );
    }

    const totalComanda = itens.reduce((acc, item) =>
        acc + (Number(item.valor_unitario) * Number(item.quantidade)), 0);

    return (
        <PageLayout title={`Consumo - Comanda ${comanda?.comanda}`}>
            {/* Info da comanda */}
            {comanda && (
                <Box sx={{ mb: 3, p: 2, backgroundColor: 'grey.100', borderRadius: 1 }}>
                    <Typography variant="h6" sx={{ mb: 0.5 }}>Comanda {comanda.comanda}</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Cliente: {comanda.cliente?.nome || comanda.cliente_id || 'Não identificado'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Abertura: {new Date(comanda.data_hora).toLocaleString('pt-BR')}
                    </Typography>
                </Box>
            )}

            {/* Aviso se sessão sem user */}
            {!user?.id && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                    Sessão não identificada. Faça logout e login novamente para adicionar itens.
                </Alert>
            )}

            {/* Formulário para adicionar itens */}
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    {editingItemId ? 'Editando Item' : 'Adicionar Item de Consumo'}
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                    {/* Produto */}
                    <Controller
                        name="produto_id"
                        control={control}
                        rules={{ required: validationRules.required }}
                        render={({ field }) => (
                            <FormControl fullWidth error={!!errors.produto_id} disabled={!!editingItemId}>
                                <InputLabel>Produto</InputLabel>
                                <Select {...field} label="Produto" value={field.value || ''}>
                                    <MenuItem value="" disabled>Selecione um produto</MenuItem>
                                    {produtos.map(p => (
                                        <MenuItem key={p.id} value={p.id}>
                                            {p.nome} — R$ {Number(p.valor_unitario).toFixed(2)}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.produto_id && (
                                    <Typography variant="caption" color="error" sx={{ ml: 1.5 }}>
                                        {errors.produto_id.message}
                                    </Typography>
                                )}
                            </FormControl>
                        )}
                    />

                    {/* Quantidade */}
                    <Controller
                        name="quantidade"
                        control={control}
                        rules={{
                            required: validationRules.required,
                            min: { value: 1, message: 'Quantidade deve ser maior que 0' }
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Quantidade"
                                type="number"
                                sx={{ width: 150 }}
                                error={!!errors.quantidade}
                                helperText={errors.quantidade?.message}
                                disabled={loading}
                                inputProps={{ min: 1 }}
                            />
                        )}
                    />
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading || !user?.id}
                        startIcon={editingItemId ? <EditIcon /> : <AddIcon />}
                    >
                        {loading ? 'Processando...' : (editingItemId ? 'Atualizar Item' : 'Adicionar Item')}
                    </Button>
                    {editingItemId && (
                        <Button variant="outlined" onClick={handleCancelEdit} disabled={loading}>
                            Cancelar Edição
                        </Button>
                    )}
                </Box>
            </Box>

            {/* Lista de itens */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Itens de Consumo</Typography>
                {itens.length > 0 && (
                    <Typography variant="h6" fontWeight={700} color="primary">
                        Total: R$ {totalComanda.toFixed(2)}
                    </Typography>
                )}
            </Box>

            {itens.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                    Nenhum item de consumo registrado
                </Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Produto</TableCell>
                                <TableCell align="center">Qtde</TableCell>
                                <TableCell align="right">Valor Unit.</TableCell>
                                <TableCell align="right">Total</TableCell>
                                <TableCell>Funcionário</TableCell>
                                <TableCell>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {itens.map((item, index) => {
                                const pNome = item.produto?.nome ||
                                    produtos.find(p => p.id === item.produto_id)?.nome ||
                                    'Produto não encontrado';
                                const fNome = item.funcionario?.nome || '-';
                                const subtotal = Number(item.valor_unitario) * Number(item.quantidade);
                                return (
                                    <TableRow key={index}
                                        sx={{ bgcolor: editingItemId === item.id ? 'action.selected' : 'inherit' }}>
                                        <TableCell>{pNome}</TableCell>
                                        <TableCell align="center">{item.quantidade}</TableCell>
                                        <TableCell align="right">R$ {Number(item.valor_unitario).toFixed(2)}</TableCell>
                                        <TableCell align="right">R$ {subtotal.toFixed(2)}</TableCell>
                                        <TableCell>{fNome}</TableCell>
                                        <TableCell>
                                            <ActionButtons
                                                item={item}
                                                onEdit={handleEditItem}
                                                onDelete={handleRemoveItem}
                                                disabled={editingItemId === item.id}
                                            />
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="outlined" onClick={() => navigate('/comandas')} disabled={loading}>
                    Voltar
                </Button>
            </Box>
        </PageLayout>
    );
};

export default ComandaConsumoForm;
