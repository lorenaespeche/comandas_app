import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Box, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/common/PageLayout';
import useValidationRules from '../hooks/useValidationRules';

const grupos = ['1', '2', '3'];

const maskCPF = (v) => v
  .replace(/\D/g, '')
  .replace(/(\d{3})(\d)/, '$1.$2')
  .replace(/(\d{3})(\d)/, '$1.$2')
  .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  .slice(0, 14);

const maskPhone = (v) => v
  .replace(/\D/g, '')
  .replace(/(\d{2})(\d)/, '($1) $2')
  .replace(/(\d{1})(\d{4})(\d{4})$/, '$1 $2-$3')
  .slice(0, 16);

const FuncionarioForm = () => {
  const { control, handleSubmit, formState: { errors }, setValue } = useForm();
  const validationRules = useValidationRules();
  const navigate = useNavigate();

  const onSubmit = (data) => console.log('Dados do funcionário:', data);
  const handleCancel = () => navigate('/funcionarios');

  return (
    <PageLayout title="Dados Funcionário" maxWidth="md">
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>

        <Controller
          name="nome"
          control={control}
          defaultValue=""
          rules={validationRules.nome}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth label="Nome" margin="normal" autoFocus
              error={!!errors.nome} helperText={errors.nome?.message}
              inputProps={{ maxLength: 100, title: 'Nome completo', placeholder: 'Ex: João da Silva' }}
            />
          )}
        />

        <Controller
          name="cpf"
          control={control}
          defaultValue=""
          rules={validationRules.cpf}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth label="CPF" margin="normal"
              error={!!errors.cpf} helperText={errors.cpf?.message}
              inputProps={{ maxLength: 14, title: 'CPF do funcionário', placeholder: '000.000.000-00' }}
              onChange={(e) => field.onChange(maskCPF(e.target.value))}
            />
          )}
        />

        <Controller
          name="telefone"
          control={control}
          defaultValue=""
          rules={validationRules.telefone}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth label="Telefone" margin="normal"
              error={!!errors.telefone} helperText={errors.telefone?.message}
              inputProps={{ maxLength: 16, title: 'Telefone com DDD', placeholder: '(49) 9 9999-9999' }}
              onChange={(e) => field.onChange(maskPhone(e.target.value))}
            />
          )}
        />

        <Controller
          name="matricula"
          control={control}
          defaultValue=""
          rules={validationRules.matricula}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth label="Matrícula" margin="normal"
              error={!!errors.matricula} helperText={errors.matricula?.message}
              inputProps={{ maxLength: 20, title: 'Matrícula do funcionário', placeholder: 'Ex: F001' }}
            />
          )}
        />

        <Controller
          name="grupo"
          control={control}
          defaultValue=""
          rules={validationRules.grupo}
          render={({ field }) => (
            <TextField
              {...field}
              select fullWidth label="Grupo" margin="normal"
              error={!!errors.grupo} helperText={errors.grupo?.message}
              title="Grupo de acesso do funcionário"
            >
              {grupos.map((g) => (
                <MenuItem key={g} value={g}>{g}</MenuItem>
              ))}
            </TextField>
          )}
        />

        <Controller
          name="senha"
          control={control}
          defaultValue=""
          rules={validationRules.senha}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth label="Senha" type="password" margin="normal"
              error={!!errors.senha} helperText={errors.senha?.message}
              inputProps={{ maxLength: 100, title: 'Senha de acesso (mín. 6 caracteres)', placeholder: 'Mínimo 6 caracteres' }}
            />
          )}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 1 }}>
          <Button onClick={handleCancel}>Cancelar</Button>
          <Button type="submit" variant="contained">Cadastrar</Button>
        </Box>
      </Box>
    </PageLayout>
  );
};

export default FuncionarioForm;
