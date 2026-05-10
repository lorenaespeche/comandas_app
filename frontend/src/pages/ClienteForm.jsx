import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/common/PageLayout';
import useValidationRules from '../hooks/useValidationRules';

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

const ClienteForm = () => {
  const { control, handleSubmit, formState: { errors } } = useForm();
  const validationRules = useValidationRules();
  const navigate = useNavigate();

  const onSubmit = (data) => console.log('Dados do cliente:', data);
  const handleCancel = () => navigate('/clientes');

  return (
    <PageLayout title="Dados Cliente" maxWidth="md">
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
              inputProps={{ maxLength: 100, title: 'Nome completo do cliente', placeholder: 'Ex: Ana Beatriz' }}
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
              inputProps={{ maxLength: 14, title: 'CPF do cliente', placeholder: '000.000.000-00' }}
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

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 1 }}>
          <Button onClick={handleCancel}>Cancelar</Button>
          <Button type="submit" variant="contained">Cadastrar</Button>
        </Box>
      </Box>
    </PageLayout>
  );
};

export default ClienteForm;
