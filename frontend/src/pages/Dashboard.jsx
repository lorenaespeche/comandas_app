import {
  Typography,
  Box
} from "@mui/material";

import PageLayout from "../components/common/PageLayout";

const Dashboard = () => {
  return (
    <PageLayout
      title={
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5
          }}
        >
          <Box
            component="img"
            src="/foto.jpeg"
            alt="Logo"
            sx={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid #fff",
              display: "block"
            }}
          />

          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              lineHeight: 1,
              m: 0
            }}
          >
            Dashboard
          </Typography>
        </Box>
      }
      maxWidth="xl"
    >
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Bem-vindo ao Comandas do Zé!
        </Typography>

        <Typography variant="body1" color="text.secondary">
          {`Data: ${new Date().toLocaleDateString('pt-BR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}`}
        </Typography>
      </Box>
    </PageLayout>
  );
};

export default Dashboard;