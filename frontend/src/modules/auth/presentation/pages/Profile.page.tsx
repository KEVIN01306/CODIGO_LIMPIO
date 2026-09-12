import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  PersonOutlineOutlined,
  EmailOutlined,
  SchoolOutlined,
  BusinessOutlined,
  BadgeOutlined,
  SecurityOutlined,
  CheckCircle,
  CalendarMonthOutlined,
  ContentCopyOutlined,
  LocationOnOutlined,
  MenuBookOutlined,
  GroupsOutlined,
  FingerprintOutlined,
} from '@mui/icons-material';
import { getProfile } from '../../infrastructure/profile.service';
import type { DetailedUserProfile } from '../../domain/auth.interfaces';
import { toast } from 'react-toastify';

interface ProfileRowProps {
  icon?: React.ReactNode;
  label: string;
  value: React.ReactNode;
  isLast?: boolean;
}

const ProfileRow: React.FC<ProfileRowProps> = ({ icon, label, value, isLast = false }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: { xs: 'column', sm: 'row' },
      justifyContent: 'space-between',
      alignItems: { xs: 'flex-start', sm: 'center' },
      py: 1.75,
      px: { xs: 2.5, sm: 3 },
      borderBottom: isLast ? 'none' : '0.5px solid',
      borderColor: 'divider',
      transition: 'background-color 0.15s ease',
      '&:hover': {
        bgcolor: 'action.hover',
      },
      gap: 1,
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 240 }}>
      {icon && (
        <Box sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', fontSize: '18px' }}>
          {icon}
        </Box>
      )}
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.04rem',
          fontSize: '11px',
        }}
      >
        {label}
      </Typography>
    </Box>

    <Box
      sx={{
        color: 'text.primary',
        fontWeight: 450,
        fontSize: '13px',
        textAlign: { xs: 'left', sm: 'right' },
        wordBreak: 'break-word',
      }}
    >
      {value || '-'}
    </Box>
  </Box>
);

const GoogleCard: React.FC<{
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, subtitle, icon, children }) => (
  <Paper
    elevation={0}
    sx={{
      border: '0.5px solid',
      borderColor: 'divider',
      borderRadius: '12px',
      overflow: 'hidden',
      mb: 3,
      bgcolor: 'background.paper',
      boxShadow: (theme) =>
        theme.palette.mode === 'dark'
          ? '0 20px 44px rgba(0,0,0,0.14)'
          : '0 4px 20px rgba(0,0,0,0.04)',
    }}
  >
    <Box sx={{ p: { xs: 2.5, sm: 3 }, pb: 2, borderBottom: '0.5px solid', borderColor: 'divider' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
        {icon && (
          <Box sx={{ color: 'primary.main', display: 'flex', alignItems: 'center', fontSize: 18 }}>
            {icon}
          </Box>
        )}
        <Typography variant="h6" sx={{ fontWeight: 450, fontSize: '16px', letterSpacing: '-0.32px', color: 'text.primary' }}>
          {title}
        </Typography>
      </Box>
      {subtitle && (
        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '13px' }}>
          {subtitle}
        </Typography>
      )}
    </Box>
    <Box>{children}</Box>
  </Paper>
);

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<DetailedUserProfile | null>(null);
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

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.info('ID copiado al portapapeles');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress sx={{ color: '#3b82f6' }} />
      </Box>
    );
  }

  if (!profile) return null;

  const formattedDate = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    : 'No disponible';

  return (
    <Box sx={{ maxWidth: 960, mx: 'auto', py: 2, px: { xs: 1, sm: 3 } }}>
      {/* Header Banner */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          py: 4,
          mb: 2,
        }}
      >
        <Avatar
          sx={{
            width: 88,
            height: 88,
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1f1f21' : '#f1f5f9'),
            color: 'text.primary',
            fontSize: '2rem',
            fontWeight: 500,
            mb: 2,
            border: '0.5px solid',
            borderColor: 'divider',
            boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.3)',
          }}
        >
          {profile.name?.charAt(0).toUpperCase() || profile.email?.charAt(0).toUpperCase()}
        </Avatar>

        <Typography variant="h4" sx={{ fontWeight: 400, fontSize: '24px', letterSpacing: '-0.64px', mb: 0.5, color: 'text.primary' }}>
          {profile.name}
        </Typography>

        <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '13px', mb: 2 }}>
          {profile.email}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
          {profile.isStudent && (
            <Chip
              icon={<SchoolOutlined sx={{ fontSize: 16 }} />}
              label="Estudiante"
              size="small"
              variant="outlined"
              sx={{
                fontWeight: 500,
                fontSize: '11px',
                borderRadius: '5.26px',
                borderColor: 'rgba(59, 130, 246, 0.3)',
                color: '#60a5fa',
                bgcolor: 'rgba(59, 130, 246, 0.08)',
              }}
            />
          )}

          {profile.isTeacher && (
            <Chip
              icon={<BadgeOutlined sx={{ fontSize: 16 }} />}
              label="Docente"
              size="small"
              variant="outlined"
              sx={{
                fontWeight: 500,
                fontSize: '11px',
                borderRadius: '5.26px',
                borderColor: 'divider',
                color: 'text.primary',
                bgcolor: 'action.hover',
              }}
            />
          )}

          {!profile.isStudent && !profile.isTeacher && (
            <Chip
              icon={<PersonOutlineOutlined sx={{ fontSize: 16 }} />}
              label={profile.roles?.[0] || 'Administrador'}
              size="small"
              variant="outlined"
              sx={{
                fontWeight: 500,
                fontSize: '11px',
                borderRadius: '5.26px',
                borderColor: 'rgba(59, 130, 246, 0.3)',
                color: '#60a5fa',
                bgcolor: 'rgba(59, 130, 246, 0.08)',
              }}
            />
          )}

          <Chip
            icon={<LocationOnOutlined sx={{ fontSize: 16 }} />}
            label={profile.establishment}
            variant="outlined"
            size="small"
            sx={{
              fontWeight: 450,
              fontSize: '11px',
              borderRadius: '5.26px',
              borderColor: 'divider',
              color: 'text.secondary',
              bgcolor: 'action.hover',
            }}
          />
        </Box>
      </Box>

      {/* Card 1: Información Personal Básica */}
      <GoogleCard
        title="Información personal"
        subtitle="Información básica de tu identidad en el sistema educativo"
        icon={<PersonOutlineOutlined />}
      >
        <ProfileRow
          icon={<PersonOutlineOutlined />}
          label="Nombre Completo"
          value={profile.name}
        />
        {profile.firstName && (
          <ProfileRow
            icon={<PersonOutlineOutlined />}
            label="Nombres"
            value={profile.firstName}
          />
        )}
        {profile.lastName && (
          <ProfileRow
            icon={<PersonOutlineOutlined />}
            label="Apellidos"
            value={profile.lastName}
          />
        )}
        <ProfileRow
          icon={<EmailOutlined />}
          label="Correo Electrónico"
          value={profile.email}
        />
        <ProfileRow
          icon={<BadgeOutlined />}
          label="Rol del Usuario"
          isLast
          value={
            <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
              {profile.roles?.map((role) => (
                <Chip
                  key={role}
                  label={role}
                  size="small"
                  variant="outlined"
                  color="primary"
                  sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                />
              ))}
            </Box>
          }
        />
      </GoogleCard>

      {/* Card 2: Establecimiento e Información Institucional / Académica */}
      <GoogleCard
        title="Establecimiento y Formación"
        subtitle="Detalles del campus, institución y perfil académico asignado"
        icon={<BusinessOutlined />}
      >
        <ProfileRow
          icon={<BusinessOutlined />}
          label="Establecimiento / Sede"
          value={
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
              {profile.establishment}
            </Typography>
          }
        />
        <ProfileRow
          icon={<LocationOnOutlined />}
          label="Institución Educativa"
          value={profile.tenantName}
        />

        {/* Sección específica para Estudiante */}
        {profile.studentInfo && (
          <>
            <ProfileRow
              icon={<BadgeOutlined />}
              label="Carné / Matrícula"
              value={
                <Chip
                  label={profile.studentInfo.studentNumber}
                  size="small"
                  color="primary"
                  variant="filled"
                  sx={{ fontWeight: 700, letterSpacing: '0.04rem' }}
                />
              }
            />
            <ProfileRow
              icon={<LocationOnOutlined />}
              label="Sede del Estudiante"
              value={profile.studentInfo.campusName}
            />
            {profile.studentInfo.programName && (
              <ProfileRow
                icon={<MenuBookOutlined />}
                label="Programa Académico"
                value={profile.studentInfo.programName}
              />
            )}
            {profile.studentInfo.cohortName && (
              <ProfileRow
                icon={<GroupsOutlined />}
                label="Cohorte Asignada"
                value={profile.studentInfo.cohortName}
              />
            )}
          </>
        )}

        {/* Sección específica para Docente */}
        {profile.teacherInfo && (
          <>
            <ProfileRow
              icon={<BadgeOutlined />}
              label="Código de Docente"
              value={
                profile.teacherInfo.employeeCode ? (
                  <Chip
                    label={profile.teacherInfo.employeeCode}
                    size="small"
                    color="secondary"
                    variant="filled"
                    sx={{ fontWeight: 700 }}
                  />
                ) : (
                  'Sin código asignado'
                )
              }
            />
            <ProfileRow
              icon={<LocationOnOutlined />}
              label="Sede Docente Asignada"
              value={profile.teacherInfo.campusName}
            />
          </>
        )}

        {/* Perfil administrativo general si no es ni estudiante ni docente */}
        {!profile.studentInfo && !profile.teacherInfo && (
          <ProfileRow
            icon={<SchoolOutlined />}
            label="Ámbito de Gestión"
            isLast
            value="Gestión y Administración Global del Sistema"
          />
        )}
      </GoogleCard>

      {/* Card 3: Seguridad y Estado de la Cuenta */}
      <GoogleCard
        title="Seguridad y Estado de la Cuenta"
        subtitle="Control de acceso y fecha de vinculación a la plataforma"
        icon={<SecurityOutlined />}
      >
        <ProfileRow
          icon={<CheckCircle />}
          label="Estado de la Cuenta"
          value={
            <Chip
              icon={<CheckCircle fontSize="small" sx={{ color: 'success.main !important' }} />}
              label="Activa y Verificada"
              size="small"
              sx={{
                bgcolor: 'rgba(46, 125, 50, 0.08)',
                color: 'success.dark',
                fontWeight: 600,
              }}
            />
          }
        />
        <ProfileRow
          icon={<CalendarMonthOutlined />}
          label="Miembro Desde"
          value={formattedDate}
        />
        <ProfileRow
          icon={<FingerprintOutlined />}
          label="ID de Usuario"
          isLast
          value={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography
                variant="caption"
                sx={{
                  fontFamily: 'monospace',
                  bgcolor: 'action.selected',
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  fontSize: '0.8rem',
                }}
              >
                {profile.id}
              </Typography>
              <Tooltip title="Copiar ID">
                <IconButton size="small" onClick={() => handleCopyId(profile.id)}>
                  <ContentCopyOutlined fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          }
        />
      </GoogleCard>
    </Box>
  );
};

export default ProfilePage;
