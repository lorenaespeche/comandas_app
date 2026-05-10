import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Card, CardContent, Box, Typography, Divider,
} from '@mui/material';
import { FiberNew } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/common/PageLayout';
import ActionButtons from '../components/common/ActionButtons';

const clientes = [
  { id: 1, nome: 'Fran', cpf: '111.222.333-44', telefone: '(49) 9 8888-0001' },
  { id: 2, nome: 'Gustavo', cpf: '555.666.777-88', telefone: '(49) 9 8888-0002' },
  { id: 3, nome: 'Luis', cpf: '999.000.111-22', telefone: '(49) 9 8888-0003' },
];

const ClienteList = () => {
  const navigate = useNavigate();

  const handleView = (c) => console.log('Visualizar:', c);
  const handleEdit = (c) => navigate(`/cliente/${c.id}`);
  const handleDelete = (c) => console.log('Excluir:', c);

  const actions = (
    <Button
      variant="contained"
      onClick={() => navigate('/cliente')}
      startIcon={<FiberNew />}
      sx={{ fontWeight: 600, px: 2, py: 1 }}
    >
      Novo
    </Button>
  );

  return (
    <PageLayout title="Clientes" actions={actions} maxWidth="xl">
      {/* Tabela Desktop */}
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {['ID', 'Nome', 'CPF', 'Telefone', 'Ações'].map((h, i) => (
                  <TableCell key={i} sx={{ fontWeight: 600 }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {clientes.map((c) => (
                <TableRow key={c.id} hover>
                  <TableCell>{c.id}</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{c.nome}</TableCell>
                  <TableCell>{c.cpf}</TableCell>
                  <TableCell>{c.telefone}</TableCell>
                  <TableCell>
                    <ActionButtons item={c} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Cards Mobile */}
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        {clientes.map((c) => (
          <Card key={c.id} sx={{ mb: 2 }}>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>{c.nome}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>ID: {c.id}</Typography>
              <Divider sx={{ mb: 1.5 }} />
              <Typography variant="body2" color="text.secondary">CPF: <strong>{c.cpf}</strong></Typography>
              <Typography variant="body2" color="text.secondary">Telefone: <strong>{c.telefone}</strong></Typography>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <ActionButtons item={c} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </PageLayout>
  );
};

export default ClienteList;
