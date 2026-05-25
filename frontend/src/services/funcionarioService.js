// Verificar se CPF já existe
checkCpfExists: async (cpf, excludeId = null) => {
  const params = { cpf };

  if (excludeId) {
    params.exclude_id = excludeId;
  }

  const response = await api.get(
    `${FUNCIONARIO.LIST}?${new URLSearchParams(params).toString()}`
  );

  const funcionarios = response.data || response;

  return funcionarios.length > 0 ? funcionarios[0] : null;
}