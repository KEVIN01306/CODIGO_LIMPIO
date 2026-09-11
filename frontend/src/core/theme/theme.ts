import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',

    primary: {
      main: '#173B57',
      light: '#2D5B7A',
      dark: '#0F293D',
      contrastText: '#FFFFFF',
    },

    secondary: {
      main: '#6C4AB6',
      light: '#8B6BC9',
      dark: '#4D3485',
      contrastText: '#FFFFFF',
    },

    success: {
      main: '#159A72',
      light: '#38B88F',
      dark: '#0D7053',
      contrastText: '#FFFFFF',
    },

    error: {
      main: '#D64545',
      light: '#E66B6B',
      dark: '#A82F2F',
      contrastText: '#FFFFFF',
    },

    warning: {
      main: '#D99124',
      light: '#E5A94D',
      dark: '#A96B13',
      contrastText: '#FFFFFF',
    },

    info: {
      main: '#2878B5',
      light: '#4C98CE',
      dark: '#1C5682',
      contrastText: '#FFFFFF',
    },

    background: {
      default: '#F6F8FA',
      paper: '#FFFFFF',
    },

    text: {
      primary: '#1B2733',
      secondary: '#607080',
      disabled: '#9AA6B2',
    },

    divider: '#E3E8ED',
  },

  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',

    h1: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },

    h2: {
      fontSize: '1.6rem',
      fontWeight: 700,
      lineHeight: 1.25,
      letterSpacing: '-0.015em',
    },

    h3: {
      fontSize: '1.35rem',
      fontWeight: 650,
      lineHeight: 1.3,
    },

    h4: {
      fontSize: '1.15rem',
      fontWeight: 650,
      lineHeight: 1.35,
    },

    h5: {
      fontSize: '1rem',
      fontWeight: 650,
    },

    h6: {
      fontSize: '0.95rem',
      fontWeight: 650,
    },

    body1: {
      fontSize: '0.95rem',
      lineHeight: 1.6,
    },

    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.55,
    },

    button: {
      fontSize: '0.875rem',
      fontWeight: 600,
      textTransform: 'none',
    },
  },

  shape: {
    borderRadius: 9,
  },

  shadows: [
    'none',
    '0 1px 2px rgba(16, 24, 40, 0.04)',
    '0 2px 5px rgba(16, 24, 40, 0.05)',
    '0 4px 10px rgba(16, 24, 40, 0.06)',
    '0 6px 16px rgba(16, 24, 40, 0.07)',
    '0 8px 24px rgba(16, 24, 40, 0.08)',
    '0 10px 28px rgba(16, 24, 40, 0.09)',
    '0 12px 32px rgba(16, 24, 40, 0.1)',
    '0 14px 36px rgba(16, 24, 40, 0.1)',
    '0 16px 40px rgba(16, 24, 40, 0.11)',
    '0 18px 44px rgba(16, 24, 40, 0.11)',
    '0 20px 48px rgba(16, 24, 40, 0.12)',
    '0 22px 52px rgba(16, 24, 40, 0.12)',
    '0 24px 56px rgba(16, 24, 40, 0.13)',
    '0 26px 60px rgba(16, 24, 40, 0.13)',
    '0 28px 64px rgba(16, 24, 40, 0.14)',
    '0 30px 68px rgba(16, 24, 40, 0.14)',
    '0 32px 72px rgba(16, 24, 40, 0.15)',
    '0 34px 76px rgba(16, 24, 40, 0.15)',
    '0 36px 80px rgba(16, 24, 40, 0.16)',
    '0 38px 84px rgba(16, 24, 40, 0.16)',
    '0 40px 88px rgba(16, 24, 40, 0.17)',
    '0 42px 92px rgba(16, 24, 40, 0.17)',
    '0 44px 96px rgba(16, 24, 40, 0.18)',
    '0 46px 100px rgba(16, 24, 40, 0.18)',
  ],

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          minHeight: 40,
          borderRadius: 8,
          padding: '8px 16px',
          boxShadow: 'none',
        },

        contained: {
          boxShadow: 'none',

          '&:hover': {
            boxShadow: 'none',
          },
        },

        outlined: {
          borderWidth: 1,

          '&:hover': {
            borderWidth: 1,
          },
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'small',
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: '#FFFFFF',

          '& fieldset': {
            borderColor: '#D9E0E6',
          },

          '&:hover fieldset': {
            borderColor: '#AEBAC5',
          },

          '&.Mui-focused fieldset': {
            borderWidth: 1.5,
          },
        },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          border: '1px solid #E3E8ED',
          boxShadow: '0 1px 3px rgba(16, 24, 40, 0.04)',
          backgroundImage: 'none',
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 600,
        },
      },
    },

    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#F7F9FB',

          '& .MuiTableCell-head': {
            color: '#526273',
            fontWeight: 650,
            fontSize: '0.8rem',
            borderBottom: '1px solid #E1E7EC',
          },
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #E8EDF1',
          padding: '12px 16px',
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          boxShadow: '0 20px 60px rgba(15, 41, 61, 0.16)',
        },
      },
    },

    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 8,
          border: '1px solid #E3E8ED',
          boxShadow: '0 8px 24px rgba(16, 24, 40, 0.10)',
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 6,
          fontSize: '0.75rem',
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#E3E8ED',
        },
      },
    },
  },
});

export default theme;