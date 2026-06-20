import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box, Typography, Button, Card, CardContent, TextField,
    Divider, CircularProgress, MenuItem, InputAdornment, Alert
} from '@mui/material';
import { ArrowBack, CheckCircle, Payments } from '@mui/icons-material';
import PageLayout from '../components/common/PageLayout';
import recebimentoService from '../services/recebimentoService';
import funcionarioService from '../services/funcionarioService';
import clienteService from '../services/clienteService';
import showSnackbar from '../utils/snackbar';
import { useAuth } from '../context/AuthContext';

function CaixaRecebimento() {
    const { ids } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [detalhes, setDetalhes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processando, setProcessando] = useState(false);

    const [funcionarios, setFuncionarios] = useState([]);
    const [clientes, setClientes] = useState([]);

    const [form, setForm] = useState({
        funcionario_id: '',
        cliente_id: '',
        desconto_valor: '',
        acrescimo_valor: ''
    });

    useEffect(() => {
        if (ids) {
            carregarDados();
        }
    }, [ids]);

    // Preencher funcionário logado automaticamente
    useEffect(() => {
        if (user?.id && form.funcionario_id === '') {
            setForm(prev => ({ ...prev, funcionario_id: user.id }));
        }
    }, [user]);

    const carregarDados = async () => {
        try {
            setLoading(true);
            const [det, funcs, clis] = await Promise.all([
                recebimentoService.detalhar(ids),
                funcionarioService.list({ limit: 200 }),
                clienteService.list({ limit: 200 })
            ]);
            setDetalhes(det);
            setFuncionarios(Array.isArray(funcs) ? funcs : funcs?.data || []);
            setClientes(Array.isArray(clis) ? clis : clis?.data || []);
        } catch (err) {
            showSnackbar('Erro ao carregar dados do recebimento', 'error');
            navigate('/caixa');
        } finally {
            setLoading(false);
        }
    };

    const subtotalGeral = detalhes.reduce((acc, d) => acc + (d.subtotal || 0), 0);
    const desconto = parseFloat(form.desconto_valor) || 0;
    const acrescimo = parseFloat(form.acrescimo_valor) || 0;
    const valorFinal = subtotalGeral - desconto + acrescimo;

    const formatCurrency = (v) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleProcessar = async () => {
        if (!form.funcionario_id) {
            showSnackbar('Selecione o funcionário responsável', 'warning');
            return;
        }
        if (valorFinal < 0) {
            showSnackbar('O desconto não pode ser maior que o total', 'error');
            return;
        }
        try {
            setProcessando(true);
            const idsArr = ids.split(',').map(Number);
            const payload = {
                comandas_ids: idsArr,
                funcionario_id: parseInt(form.funcionario_id),
                cliente_id: form.cliente_id ? parseInt(form.cliente_id) : null,
                desconto_valor: desconto || null,
                acrescimo_valor: acrescimo || null,
            };
            const resultado = await recebimentoService.processar(payload);
            showSnackbar('Recebimento realizado com sucesso!', 'success');
            navigate(`/caixa/comprovante/${resultado.recebimento_id}`);
        } catch (err) {
            const msg = err?.response?.data?.detail || 'Erro ao processar recebimento';
            showSnackbar(msg, 'error');
        } finally {
            setProcessando(false);
        }
    };

    return (
        <PageLayout
            title="Caixa — Recebimento"
            actions={
                <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => navigate(`/caixa/detalhe/${ids}`)}>
                    Voltar
                </Button>
            }
        >
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                    {/* Resumo das comandas */}
                    <Box sx={{ flex: '1 1 300px' }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            Resumo das Comandas
                        </Typography>
                        {detalhes.map(d => (
                            <Card key={d.comanda_id} sx={{ mb: 2 }}>
                                <CardContent sx={{ '&:last-child': { pb: 1.5 }, py: 1.5 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography fontWeight={600}>Comanda: {d.comanda}</Typography>
                                        <Typography fontWeight={600}>{formatCurrency(d.subtotal)}</Typography>
                                    </Box>
                                    {d.cliente && (
                                        <Typography variant="caption" color="text.secondary">
                                            Cliente: {d.cliente.nome}
                                        </Typography>
                                    )}
                                    <Typography variant="caption" color="text.secondary" display="block">
                                        {d.itens?.length || 0} item(s)
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))}

                        {/* Totalizador */}
                        <Card sx={{ bgcolor: 'grey.50' }}>
                            <CardContent sx={{ '&:last-child': { pb: 1.5 }, py: 1.5 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography color="text.secondary">Subtotal</Typography>
                                    <Typography>{formatCurrency(subtotalGeral)}</Typography>
                                </Box>
                                {desconto > 0 && (
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                        <Typography color="error.main">— Desconto</Typography>
                                        <Typography color="error.main">— {formatCurrency(desconto)}</Typography>
                                    </Box>
                                )}
                                {acrescimo > 0 && (
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                        <Typography color="warning.main">+ Acréscimo</Typography>
                                        <Typography color="warning.main">+ {formatCurrency(acrescimo)}</Typography>
                                    </Box>
                                )}
                                <Divider sx={{ my: 1 }} />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="h6" fontWeight={700}>Total Final</Typography>
                                    <Typography variant="h6" fontWeight={700} color="success.main">
                                        {formatCurrency(valorFinal)}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>

                    {/* Formulário de pagamento */}
                    <Box sx={{ flex: '1 1 300px' }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            Informações do Pagamento
                        </Typography>
                        <Card>
                            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <TextField
                                    select
                                    label="Funcionário Responsável"
                                    name="funcionario_id"
                                    value={form.funcionario_id}
                                    onChange={handleChange}
                                    required
                                    fullWidth
                                >
                                    <MenuItem value="">Selecione...</MenuItem>
                                    {funcionarios.map(f => (
                                        <MenuItem key={f.id} value={f.id}>{f.nome} ({f.matricula})</MenuItem>
                                    ))}
                                </TextField>

                                <TextField
                                    select
                                    label="Cliente (opcional)"
                                    name="cliente_id"
                                    value={form.cliente_id}
                                    onChange={handleChange}
                                    fullWidth
                                >
                                    <MenuItem value="">Não informado</MenuItem>
                                    {clientes.map(c => (
                                        <MenuItem key={c.id} value={c.id}>{c.nome}</MenuItem>
                                    ))}
                                </TextField>

                                <TextField
                                    label="Desconto (R$)"
                                    name="desconto_valor"
                                    type="number"
                                    value={form.desconto_valor}
                                    onChange={handleChange}
                                    fullWidth
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">R$</InputAdornment>
                                    }}
                                    inputProps={{ min: 0, step: 0.01 }}
                                />

                                <TextField
                                    label="Acréscimo (R$)"
                                    name="acrescimo_valor"
                                    type="number"
                                    value={form.acrescimo_valor}
                                    onChange={handleChange}
                                    fullWidth
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">R$</InputAdornment>
                                    }}
                                    inputProps={{ min: 0, step: 0.01 }}
                                />

                                {valorFinal < 0 && (
                                    <Alert severity="error">
                                        O desconto ({formatCurrency(desconto)}) não pode ser maior que o total ({formatCurrency(subtotalGeral)})
                                    </Alert>
                                )}

                                <Divider />

                                <Box sx={{ textAlign: 'right' }}>
                                    <Typography variant="h5" fontWeight={700} color="success.main" gutterBottom>
                                        {formatCurrency(valorFinal)}
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        size="large"
                                        startIcon={processando ? <CircularProgress size={20} color="inherit" /> : <CheckCircle />}
                                        onClick={handleProcessar}
                                        disabled={processando || valorFinal < 0 || !form.funcionario_id}
                                        fullWidth
                                        sx={{ py: 1.5 }}
                                    >
                                        {processando ? 'Processando...' : 'Finalizar Recebimento'}
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>
                </Box>
            )}
        </PageLayout>
    );
}

export default CaixaRecebimento;
