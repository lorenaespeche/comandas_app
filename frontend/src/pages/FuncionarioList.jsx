import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Card, CardContent, Box, Typography, Chip, Divider,
} from '@mui/material';
import { FiberNew } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/common/PageLayout';
import ActionButtons from '../components/common/ActionButtons';
import { getGrupoInfo } from '../constants/userGroups';
import { useMasks } from '../hooks/useMasks';

const funcionarios = [
  { id: 1, nome: 'Zé', cpf: '123', matricula: '7001', grupo: '1', telefone: '(49) 9 9999-0001' },
  { id: 2, nome: 'Loly', cpf: '456', matricula: '7002', grupo: '1', telefone: '(49) 9 9999-0002' },
  { id: 3, nome: 'Lorena', cpf: '789', matricula: '7003', grupo: '1', telefone: '(49) 9 9999-0003' },
];

const FuncionarioList = () => {
  const navigate = useNavigate();

  // Hook de máscaras
  const { applyCpfMask, applyPhoneMask } = useMasks();

  const handleView = (f) => console.log('Visualizar:', f);
  const handleEdit = (f) => navigate(`/funcionario/${f.id}`);
  const handleDelete = (f) => console.log('Excluir:', f);

  const actions = (
    <Button
      variant="contained"
      onClick={() => navigate('/funcionario')}
      startIcon={<FiberNew />}
      sx={{ fontWeight: 600, px: 2, py: 1 }}
    >
      Novo
    </Button>
  );

  return (
    <PageLayout title="Funcionários" actions={actions} maxWidth="xl">
      {/* Tabela Desktop */}
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {['ID', 'Nome', 'CPF', 'Matrícula', 'Grupo', 'Ações'].map((h, i) => (
                  <TableCell key={i} sx={{ fontWeight: 600 }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {funcionarios.map((f) => (
                <TableRow key={f.id} hover>
                  <TableCell>{f.id}</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{f.nome}</TableCell>
                  <TableCell>{applyCpfMask(f.cpf)}</TableCell>
                  <TableCell>{f.matricula}</TableCell>
                  <TableCell>
                    <Chip
                      label={getGrupoInfo(f.grupo).label}
                      color={getGrupoInfo(f.grupo).color}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <ActionButtons item={f} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Cards Mobile */}
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        {funcionarios.map((f) => (
          <Card key={f.id} sx={{ mb: 2 }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>{f.nome}</Typography>
                  <Typography variant="body2" color="text.secondary">ID: {f.id}</Typography>
                </Box>
                <Chip
                  label={getGrupoInfo(f.grupo).label}
                  color={getGrupoInfo(f.grupo).color}
                  size="small"
                />
              </Box>
              <Divider sx={{ mb: 1.5 }} />
              <Typography variant="body2" color="text.secondary">CPF: <strong>{applyCpfMask(f.cpf)}</strong></Typography>
              <Typography variant="body2" color="text.secondary">Matrícula: <strong>{f.matricula}</strong></Typography>
              <Typography variant="body2" color="text.secondary">Telefone: <strong>{applyPhoneMask(f.telefone)}</strong></Typography>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <ActionButtons item={f} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </PageLayout>
  );
};

export default FuncionarioList;