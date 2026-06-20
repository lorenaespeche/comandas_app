import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Typography, Grid, Card, CardContent, CardActionArea,
    Chip, Button, TextField, InputAdornment, CircularProgress,
    Divider
} from '@mui/material';
import {
    Search, Receipt, Person,
    ShoppingCart, CheckCircle, PlayArrow
} from '@mui/icons-material';
import PageLayout from '../components/common/PageLayout';
import recebimentoService from '../services/recebimentoService';
import showSnackbar from '../utils/snackbar';

function CaixaDashboard() {
    const navigate = useNavigate();
    const [comandas, setComandas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selecionadas, setSelecionadas] = useState([]);
    const [busca, setBusca] = useState('');

    useEffect(() => {
        carregarDashboard();
    }, []);

    const carregarDashboard = async () => {
        try {
            setLoading(true);
            const data = await recebimentoService.dashboard();
            setComandas(data);
        } catch (err) {
            showSnackbar('Erro ao carregar dashboard do caixa', 'error');
        } finally {
            setLoading(false);
        }
    };

    const toggleSelecionada = (comanda) => {
        setSelecionadas(prev => {
            const jaesta = prev.some(c => c.id === comanda.id);
            if (jaesta) return prev.filter(c => c.id !== comanda.id);
            return [...prev, comanda];
        });
    };

    const isSelecionada = (id) => selecionadas.some(c => c.id === id);

    const handleBusca = (e) => {
        const val = e.target.value;
        setBusca(val);
        // busca por número: se digitar um número e apertar Enter seleciona a comanda
    };

    const handleBuscaKeyDown = (e) => {
        if (e.key === 'Enter' && busca.trim()) {
            const encontrada = comandas.find(c =>
                c.comanda.toString() === busca.trim() ||
                c.comanda.toLowerCase() === busca.trim().toLowerCase()
            );
            if (encontrada) {
                toggleSelecionada(encontrada);
                setBusca('');
                showSnackbar(`Comanda ${encontrada.comanda} adicionada`, 'success');
            } else {
                showSnackbar(`Comanda "${busca}" não encontrada ou não está aberta`, 'warning');
            }
        }
    };

    const totalSelecionado = selecionadas.reduce((acc, c) => acc + c.total, 0);

    const handleProsseguir = () => {
        if (selecionadas.length === 0) {
            showSnackbar('Selecione ao menos uma comanda', 'warning');
            return;
        }
        const ids = selecionadas.map(c => c.id).join(',');
        navigate(`/caixa/detalhe/${ids}`);
    };

    const comandasFiltradas = busca
        ? comandas.filter(c =>
            c.comanda.toString().toLowerCase().includes(busca.toLowerCase()) ||
            (c.cliente?.nome || '').toLowerCase().includes(busca.toLowerCase())
          )
        : comandas;

    const formatCurrency = (v) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

    return (
        <PageLayout
            title="Caixa — Comandas Abertas"
            actions={
                <Button
                    variant="contained"
                    color="success"
                    startIcon={<PlayArrow />}
                    onClick={handleProsseguir}
                    disabled={selecionadas.length === 0}
                    size="large"
                >
                    Prosseguir ({selecionadas.length})
                </Button>
            }
        >
            {/* Barra de busca e resumo */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
                <TextField
                    placeholder="Buscar pelo número ou nome da comanda (Enter para selecionar)"
                    value={busca}
                    onChange={handleBusca}
                    onKeyDown={handleBuscaKeyDown}
                    size="small"
                    sx={{ flexGrow: 1, minWidth: 280 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search fontSize="small" />
                            </InputAdornment>
                        )
                    }}
                />
                <Button variant="outlined" onClick={carregarDashboard} size="small">
                    Atualizar
                </Button>
            </Box>

            {/* Resumo das selecionadas */}
            {selecionadas.length > 0 && (
                <Card sx={{ mb: 3, bgcolor: 'success.50', border: '2px solid', borderColor: 'success.main' }}>
                    <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                            <CheckCircle color="success" />
                            <Typography fontWeight={600} color="success.dark">
                                {selecionadas.length} comanda(s) selecionada(s)
                            </Typography>
                            <Typography color="success.dark">
                                {selecionadas.map(c => c.comanda).join(', ')}
                            </Typography>
                            <Box sx={{ ml: 'auto' }}>
                                <Typography variant="h6" fontWeight={700} color="success.dark">
                                    Total: {formatCurrency(totalSelecionado)}
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            )}

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                    <CircularProgress />
                </Box>
            ) : comandasFiltradas.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                    <Receipt sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                    <Typography color="text.secondary">
                        {busca ? 'Nenhuma comanda encontrada para esta busca' : 'Nenhuma comanda aberta no momento'}
                    </Typography>
                </Box>
            ) : (
                <Grid container spacing={2}>
                    {comandasFiltradas.map((comanda) => {
                        const sel = isSelecionada(comanda.id);
                        return (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={comanda.id}>
                                <Card
                                    sx={{
                                        border: '2px solid',
                                        borderColor: sel ? 'primary.main' : 'divider',
                                        bgcolor: sel ? 'primary.50' : 'background.paper',
                                        transition: 'all 0.2s',
                                        '&:hover': { borderColor: 'primary.main', elevation: 4 }
                                    }}
                                >
                                    <CardActionArea onClick={() => toggleSelecionada(comanda)} sx={{ p: 0 }}>
                                        <CardContent>
                                            {/* Cabeçalho */}
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                                <Box>
                                                    <Typography variant="h5" fontWeight={700} color={sel ? 'primary.main' : 'text.primary'}>
                                                        {comanda.comanda}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {new Date(comanda.data_hora).toLocaleString('pt-BR')}
                                                    </Typography>
                                                </Box>
                                                {sel && <CheckCircle color="primary" />}
                                            </Box>
                                            <Divider sx={{ my: 1 }} />
                                            {/* Cliente */}
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                                                <Person fontSize="small" color="action" />
                                                <Typography variant="body2" color="text.secondary">
                                                    {comanda.cliente?.nome || 'Cliente não identificado'}
                                                </Typography>
                                            </Box>
                                            {/* Produtos */}
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                                                <ShoppingCart fontSize="small" color="action" />
                                                <Typography variant="body2" color="text.secondary">
                                                    {comanda.quantidade_produtos} item(s)
                                                </Typography>
                                            </Box>
                                            {/* Total */}
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <Chip
                                                    label="Aberta"
                                                    size="small"
                                                    color="success"
                                                    variant="outlined"
                                                />
                                                <Typography variant="h6" fontWeight={700} color={sel ? 'primary.main' : 'text.primary'}>
                                                    {formatCurrency(comanda.total)}
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            )}

            {/* Botão flutuante na parte inferior */}
            {selecionadas.length > 0 && (
                <Box sx={{ position: 'sticky', bottom: 16, display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                    <Button
                        variant="contained"
                        color="success"
                        size="large"
                        startIcon={<PlayArrow />}
                        onClick={handleProsseguir}
                        sx={{ boxShadow: 4, px: 4, py: 1.5 }}
                    >
                        Prosseguir com {selecionadas.length} comanda(s) — {formatCurrency(totalSelecionado)}
                    </Button>
                </Box>
            )}
        </PageLayout>
    );
}

export default CaixaDashboard;
