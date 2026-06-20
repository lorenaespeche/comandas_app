import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box, Typography, Button, Card, CardContent,
    Divider, CircularProgress, Table, TableBody,
    TableCell, TableHead, TableRow, Chip, Avatar
} from '@mui/material';
import { Home, Print, Receipt, CheckCircle, Person, Badge } from '@mui/icons-material';
import PageLayout from '../components/common/PageLayout';
import recebimentoService from '../services/recebimentoService';
import showSnackbar from '../utils/snackbar';

function CaixaComprovante() {
    const { id } = useParams();
    const navigate = useNavigate();
    const printRef = useRef();

    const [comprovante, setComprovante] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) carregarComprovante();
    }, [id]);

    const carregarComprovante = async () => {
        try {
            setLoading(true);
            const data = await recebimentoService.comprovante(id);
            setComprovante(data);
        } catch (err) {
            showSnackbar('Erro ao carregar comprovante', 'error');
            navigate('/caixa');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (v) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

    const fotoUrl = (foto) => {
        if (!foto) return null;
        if (typeof foto === 'string') return `data:image/jpeg;base64,${foto}`;
        return null;
    };

    const handlePrint = () => window.print();

    if (loading) {
        return (
            <PageLayout title="Comprovante de Recebimento">
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                    <CircularProgress />
                </Box>
            </PageLayout>
        );
    }

    if (!comprovante) return null;

    const { cabecalho, cliente, funcionario, comandas, resumo_valores, recebimento, rodape, data_emissao } = comprovante;

    return (
        <PageLayout
            title="Comprovante de Recebimento"
            actions={
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button variant="outlined" startIcon={<Print />} onClick={handlePrint}>
                        Imprimir
                    </Button>
                    <Button variant="contained" startIcon={<Home />} onClick={() => navigate('/caixa')}>
                        Voltar ao Caixa
                    </Button>
                </Box>
            }
        >
            <Box ref={printRef} sx={{ maxWidth: 700, mx: 'auto' }}>
                {/* Cabeçalho do comprovante */}
                <Card sx={{ mb: 3, bgcolor: 'success.main', color: 'white' }}>
                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                        <CheckCircle sx={{ fontSize: 48, mb: 1 }} />
                        <Typography variant="h4" fontWeight={700} color="inherit">
                            {cabecalho?.titulo || 'Comprovante de Recebimento'}
                        </Typography>
                        <Typography color="inherit" sx={{ opacity: 0.9 }}>
                            {cabecalho?.sistema || 'Comandas do Zé'}
                        </Typography>
                        <Typography variant="caption" color="inherit" sx={{ opacity: 0.8 }}>
                            Emitido em: {new Date(data_emissao).toLocaleString('pt-BR')}
                        </Typography>
                    </CardContent>
                </Card>

                {/* Info recebimento, funcionário e cliente */}
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            Informações do Recebimento
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                            <Box>
                                <Typography variant="caption" color="text.secondary">Nº Recebimento</Typography>
                                <Typography fontWeight={600}>#{recebimento?.id}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary">Data/Hora</Typography>
                                <Typography fontWeight={600}>
                                    {new Date(recebimento?.data_hora).toLocaleString('pt-BR')}
                                </Typography>
                            </Box>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Badge color="action" />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Funcionário</Typography>
                                    <Typography fontWeight={600}>{funcionario?.nome}</Typography>
                                    <Typography variant="caption" color="text.secondary">Matrícula: {funcionario?.matricula}</Typography>
                                </Box>
                            </Box>

                            {cliente && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Person color="action" />
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Cliente</Typography>
                                        <Typography fontWeight={600}>{cliente.nome}</Typography>
                                        <Typography variant="caption" color="text.secondary">CPF: {cliente.cpf}</Typography>
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    </CardContent>
                </Card>

                {/* Detalhes de cada comanda */}
                {comandas?.map((comanda) => (
                    <Card key={comanda.comanda_id} sx={{ mb: 2 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Receipt color="primary" />
                                    <Typography variant="h6" fontWeight={700}>
                                        Comanda: {comanda.comanda}
                                    </Typography>
                                </Box>
                                <Chip label="Quitada" color="success" size="small" />
                            </Box>

                            {comanda.cliente && (
                                <Typography variant="body2" color="text.secondary" mb={1}>
                                    Cliente: {comanda.cliente.nome}
                                </Typography>
                            )}

                            <Table size="small">
                                <TableHead>
                                    <TableRow sx={{ bgcolor: 'grey.50' }}>
                                        <TableCell>Foto</TableCell>
                                        <TableCell>Produto</TableCell>
                                        <TableCell align="center">Qtde</TableCell>
                                        <TableCell align="right">Unit.</TableCell>
                                        <TableCell align="right">Subtotal</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {comanda.itens?.map((item, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell>
                                                {fotoUrl(item.produto_foto) ? (
                                                    <Avatar
                                                        src={fotoUrl(item.produto_foto)}
                                                        variant="rounded"
                                                        sx={{ width: 36, height: 36 }}
                                                    />
                                                ) : (
                                                    <Avatar variant="rounded" sx={{ width: 36, height: 36, bgcolor: 'grey.100' }}>
                                                        <Receipt fontSize="small" color="disabled" />
                                                    </Avatar>
                                                )}
                                            </TableCell>
                                            <TableCell>{item.produto_nome}</TableCell>
                                            <TableCell align="center">{item.quantidade}</TableCell>
                                            <TableCell align="right">{formatCurrency(item.valor_unitario)}</TableCell>
                                            <TableCell align="right"><strong>{formatCurrency(item.subtotal)}</strong></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                                <Typography fontWeight={600}>
                                    Subtotal: {formatCurrency(comanda.subtotal)}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                ))}

                {/* Resumo de valores */}
                <Card sx={{ mb: 3, border: '2px solid', borderColor: 'success.main' }}>
                    <CardContent>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            Resumo de Valores
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography color="text.secondary">Subtotal Geral</Typography>
                                <Typography>{formatCurrency(resumo_valores?.subtotal_geral)}</Typography>
                            </Box>
                            {resumo_valores?.desconto_total > 0 && (
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography color="error.main">— Desconto</Typography>
                                    <Typography color="error.main">— {formatCurrency(resumo_valores.desconto_total)}</Typography>
                                </Box>
                            )}
                            {resumo_valores?.acrescimo_total > 0 && (
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography color="warning.main">+ Acréscimo</Typography>
                                    <Typography color="warning.main">+ {formatCurrency(resumo_valores.acrescimo_total)}</Typography>
                                </Box>
                            )}
                            <Divider />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h5" fontWeight={700}>Total Pago</Typography>
                                <Typography variant="h4" fontWeight={700} color="success.main">
                                    {formatCurrency(resumo_valores?.valor_final)}
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>

                {/* Rodapé */}
                <Box sx={{ textAlign: 'center', py: 2, color: 'text.secondary' }}>
                    <Typography variant="body2">{rodape?.mensagem}</Typography>
                    <Typography variant="caption">{rodape?.sistema}</Typography>
                </Box>

                {/* Botões de ação */}
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
                    <Button variant="outlined" startIcon={<Print />} onClick={handlePrint}>
                        Imprimir Comprovante
                    </Button>
                    <Button variant="contained" color="primary" startIcon={<Home />} onClick={() => navigate('/caixa')}>
                        Nova Venda
                    </Button>
                </Box>
            </Box>
        </PageLayout>
    );
}

export default CaixaComprovante;
