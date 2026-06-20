import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box, Typography, Button, Card, CardContent,
    Divider, CircularProgress, Table, TableBody,
    TableCell, TableHead, TableRow, Chip, Avatar
} from '@mui/material';
import { ArrowBack, ArrowForward, Receipt, Person } from '@mui/icons-material';
import PageLayout from '../components/common/PageLayout';
import recebimentoService from '../services/recebimentoService';
import showSnackbar from '../utils/snackbar';

function CaixaDetalhe() {
    const { ids } = useParams();
    const navigate = useNavigate();
    const [detalhes, setDetalhes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (ids) carregarDetalhes();
    }, [ids]);

    const carregarDetalhes = async () => {
        try {
            setLoading(true);
            const data = await recebimentoService.detalhar(ids);
            setDetalhes(data);
        } catch (err) {
            showSnackbar('Erro ao carregar detalhes das comandas', 'error');
            navigate('/caixa');
        } finally {
            setLoading(false);
        }
    };

    const totalGeral = detalhes.reduce((acc, d) => acc + (d.subtotal || 0), 0);

    const formatCurrency = (v) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

    const fotoUrl = (foto) => {
        if (!foto) return null;
        if (typeof foto === 'string') return `data:image/jpeg;base64,${foto}`;
        return null;
    };

    return (
        <PageLayout
            title="Caixa — Conferência de Comandas"
            actions={
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={() => navigate('/caixa')}
                    >
                        Voltar
                    </Button>
                    <Button
                        variant="contained"
                        color="success"
                        endIcon={<ArrowForward />}
                        onClick={() => navigate(`/caixa/recebimento/${ids}`)}
                    >
                        Ir para Pagamento
                    </Button>
                </Box>
            }
        >
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    {/* Card de cada comanda */}
                    {detalhes.map((detalhe) => (
                        <Card key={detalhe.comanda_id} sx={{ mb: 3 }}>
                            <CardContent>
                                {/* Cabeçalho da comanda */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Receipt color="primary" />
                                        <Typography variant="h5" fontWeight={700}>
                                            Comanda: {detalhe.comanda}
                                        </Typography>
                                    </Box>
                                    <Chip label="Aberta" color="success" variant="outlined" />
                                </Box>

                                {/* Info cliente e data */}
                                <Box sx={{ display: 'flex', gap: 3, mb: 2, flexWrap: 'wrap' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Person fontSize="small" color="action" />
                                        <Typography variant="body2" color="text.secondary">
                                            {detalhe.cliente?.nome || 'Cliente não identificado'}
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Aberta em: {new Date(detalhe.data_hora).toLocaleString('pt-BR')}
                                    </Typography>
                                </Box>

                                <Divider sx={{ mb: 2 }} />

                                {/* Tabela de produtos */}
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Foto</TableCell>
                                            <TableCell>Produto</TableCell>
                                            <TableCell align="center">Qtde</TableCell>
                                            <TableCell align="right">Valor Unit.</TableCell>
                                            <TableCell align="right">Subtotal</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {detalhe.itens?.map((item, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell>
                                                    {fotoUrl(item.produto_foto) ? (
                                                        <Avatar
                                                            src={fotoUrl(item.produto_foto)}
                                                            variant="rounded"
                                                            sx={{ width: 40, height: 40 }}
                                                        />
                                                    ) : (
                                                        <Avatar
                                                            variant="rounded"
                                                            sx={{ width: 40, height: 40, bgcolor: 'grey.200' }}
                                                        >
                                                            <Receipt fontSize="small" color="disabled" />
                                                        </Avatar>
                                                    )}
                                                </TableCell>
                                                <TableCell>{item.produto_nome}</TableCell>
                                                <TableCell align="center">{item.quantidade}</TableCell>
                                                <TableCell align="right">{formatCurrency(item.valor_unitario)}</TableCell>
                                                <TableCell align="right">
                                                    <strong>{formatCurrency(item.subtotal)}</strong>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                {/* Subtotal da comanda */}
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                    <Typography variant="h6" fontWeight={700}>
                                        Subtotal: {formatCurrency(detalhe.subtotal)}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}

                    {/* Total Geral */}
                    <Card sx={{ bgcolor: 'primary.main', color: 'white', mb: 3 }}>
                        <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6" color="inherit">
                                    {detalhes.length} comanda(s) selecionada(s)
                                </Typography>
                                <Typography variant="h4" fontWeight={700} color="inherit">
                                    Total: {formatCurrency(totalGeral)}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Botão de avançar */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => navigate('/caixa')}>
                            Voltar ao Caixa
                        </Button>
                        <Button
                            variant="contained"
                            color="success"
                            size="large"
                            endIcon={<ArrowForward />}
                            onClick={() => navigate(`/caixa/recebimento/${ids}`)}
                            sx={{ px: 4 }}
                        >
                            Ir para Pagamento
                        </Button>
                    </Box>
                </>
            )}
        </PageLayout>
    );
}

export default CaixaDetalhe;
