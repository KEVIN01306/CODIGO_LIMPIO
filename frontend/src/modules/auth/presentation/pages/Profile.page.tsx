import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid, CircularProgress, Chip, Avatar } from '@mui/material';
import { getProfile } from '../../infrastructure/profile.service';
import type { AuthUser } from '../../domain/auth.interfaces';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const [profile, setProfile] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile()
      .then((data) => {
        setProfile(data);
      })
      .catch(() => {
        toast.error('Error al cargar la información del perfil');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: 300 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!profile) return null;

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }} color="primary">
        Mi Perfil
      </Typography>
      
      <Paper sx={{ p: 4, borderRadius: 2, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ width: 120, height: 120, bgcolor: 'primary.main', fontSize: '3rem' }}>
            {profile.name?.charAt(0).toUpperCase() || profile.email?.charAt(0).toUpperCase()}
          </Avatar>
          <Chip label={profile.roles?.[0] || 'USUARIO'} color="secondary" />
        </Box>
        
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">Nombre Completo</Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{profile.name}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">Correo Electrónico</Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{profile.email}</Typography>
            </Grid>
            
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>Roles Asignados</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {profile.roles?.map(role => (
                  <Chip key={role} label={role} size="small" variant="outlined" color="primary" />
                ))}
              </Box>
            </Grid>
            
            {profile.permissions && profile.permissions.length > 0 && (
              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Permisos de Acceso</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {profile.permissions.map(perm => (
                    <Chip key={perm} label={perm} size="small" variant="outlined" />
                  ))}
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default ProfilePage;
