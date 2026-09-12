import { createTheme } from '@mui/material/styles';

/**
 * Design Tokens from DESING.md
 * Mission control behind frosted glass — weight 400 headlines float over matte-black panels.
 */
export const designTokens = {
  colors: {
    void: '#0b0c0e',
    graphite: '#131416',
    charcoal: '#1f1f21',
    smoke: '#3c3d3e',
    steel: '#71717a',
    fog: '#858687',
    ash: '#9d9e9f',
    chalk: '#cececf',
    snow: '#ffffff',
    bone: '#f2f2f2',
    ink: '#333333',
    signalBlue: '#3b82f6',
    arcBlue: '#60a5fa',
    ringBlue: '#93c5fd',
    mint: '#4ade80',
    fern: '#22c55e',
    coral: '#f87171',
    ember: '#ea580c',
    iris: '#314ef0',
  },
  radii: {
    xs: 5.26,
    sm: 8.77,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    cards: 12,
    pills: 10,
    buttons: 10,
  },
  hairlines: {
    border: '0.5px solid rgba(255, 255, 255, 0.07)',
    borderSubtle: '0.5px solid rgba(255, 255, 255, 0.05)',
    card: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 0.5px rgba(255,255,255,0.07), 0 20px 44px rgba(0,0,0,0.14), 0 4px 10px rgba(0,0,0,0.08)',
    panel: 'inset 0 1px 0 rgba(255,255,255,0.09), 0 0 0 0.5px rgba(255,255,255,0.07), 0 16px 36px rgba(0,0,0,0.12)',
  },
};

export const getAppTheme = (mode: 'dark' | 'light' = 'dark') => {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,

      // Canvas & Surface Hierarchy
      background: {
        default: isDark ? '#0b0c0e' : '#f8fafc', // Void in dark, Slate 50 in light
        paper: isDark ? '#131416' : '#ffffff',   // Graphite in dark, White in light
      },

      // CTA & Primary action (Bone off-white pill in dark, Deep slate pill in light)
      primary: {
        main: isDark ? '#f2f2f2' : '#0f172a',
        light: isDark ? '#ffffff' : '#334155',
        dark: isDark ? '#dcdcdc' : '#020617',
        contrastText: isDark ? '#131416' : '#ffffff',
      },

      // Secondary actions
      secondary: {
        main: isDark ? '#858687' : '#64748b',
        light: isDark ? '#cececf' : '#94a3b8',
        dark: isDark ? '#71717a' : '#475569',
        contrastText: '#ffffff',
      },

      // Brand accent (Signal Blue — active nav, links, highlights)
      info: {
        main: isDark ? '#3b82f6' : '#2563eb',
        light: isDark ? '#60a5fa' : '#3b82f6',
        dark: isDark ? '#314ef0' : '#1d4ed8',
        contrastText: '#ffffff',
      },

      // Semantic signals
      success: {
        main: isDark ? '#22c55e' : '#16a34a',
        light: isDark ? '#4ade80' : '#22c55e',
        dark: isDark ? '#16a34a' : '#15803d',
        contrastText: '#ffffff',
      },

      error: {
        main: isDark ? '#f87171' : '#dc2626',
        light: isDark ? '#fca5a5' : '#ef4444',
        dark: isDark ? '#ef4444' : '#b91c1c',
        contrastText: '#ffffff',
      },

      warning: {
        main: isDark ? '#ea580c' : '#d97706',
        light: isDark ? '#f97316' : '#f59e0b',
        dark: isDark ? '#c2410c' : '#b45309',
        contrastText: '#ffffff',
      },

      text: {
        primary: isDark ? '#ffffff' : '#0f172a',   // Snow in dark, Slate 900 in light
        secondary: isDark ? '#858687' : '#64748b', // Fog in dark, Slate 500 in light
        disabled: isDark ? '#9d9e9f' : '#94a3b8',  // Ash in dark, Slate 400 in light
      },

      divider: isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.08)',

      action: {
        hover: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
        selected: isDark ? 'rgba(59, 130, 246, 0.12)' : 'rgba(37, 99, 235, 0.08)',
        disabled: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.26)',
        disabledBackground: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
      },
    },

    typography: {
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',

      // Whisper-weight headlines: weight 400 with negative tracking
      h1: {
        fontSize: '52px',
        fontWeight: 400,
        lineHeight: 1.0,
        letterSpacing: '-1.3px',
        color: isDark ? '#ffffff' : '#0f172a',
      },

      h2: {
        fontSize: '42px',
        fontWeight: 400,
        lineHeight: 1.2,
        letterSpacing: '-0.88px',
        color: isDark ? '#ffffff' : '#0f172a',
      },

      h3: {
        fontSize: '32px',
        fontWeight: 400,
        lineHeight: 1.25,
        letterSpacing: '-0.64px',
        color: isDark ? '#ffffff' : '#0f172a',
      },

      h4: {
        fontSize: '24px',
        fontWeight: 400,
        lineHeight: 1.3,
        letterSpacing: '-0.5px',
        color: isDark ? '#ffffff' : '#0f172a',
      },

      h5: {
        fontSize: '18px',
        fontWeight: 450,
        lineHeight: 1.3,
        letterSpacing: '-0.61px',
        color: isDark ? '#ffffff' : '#0f172a',
      },

      h6: {
        fontSize: '15px',
        fontWeight: 500,
        lineHeight: 1.4,
        letterSpacing: '-0.32px',
        color: isDark ? '#ffffff' : '#0f172a',
      },

      body1: {
        fontSize: '15px',
        fontWeight: 400,
        lineHeight: 1.5,
        letterSpacing: '-0.32px',
        color: isDark ? '#cececf' : '#334155',
      },

      body2: {
        fontSize: '13px',
        fontWeight: 400,
        lineHeight: 1.43,
        letterSpacing: '-0.026em',
        color: isDark ? '#858687' : '#64748b',
      },

      button: {
        fontSize: '14px',
        fontWeight: 450,
        letterSpacing: '-0.2px',
        textTransform: 'none',
      },

      caption: {
        fontSize: '11px',
        fontWeight: 400,
        letterSpacing: '-0.015em',
        color: isDark ? '#858687' : '#64748b',
      },

      overline: {
        fontSize: '9px',
        fontWeight: 500,
        letterSpacing: '0.06em',
        color: isDark ? '#71717a' : '#94a3b8',
        textTransform: 'uppercase',
      },
    },

    shape: {
      borderRadius: 10,
    },

    shadows: [
      'none',
      'rgba(0, 0, 0, 0.1) 0px 1px 4px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px',
      'rgba(0, 0, 0, 0.02) 0px 2px 4px 0px, rgba(0, 0, 0, 0.02) 0px 0px 8px 0px',
      'rgba(0, 0, 0, 0.25) 0px 1px 2px 0px inset, rgba(0, 0, 0, 0.02) 0px 2px 4px 0px',
      'rgba(0, 0, 0, 0.04) 0px 0px 0px 1px, rgba(0, 0, 0, 0.06) 0px 1px 1px -0.5px',
      'rgba(0, 0, 0, 0.04) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 2px 4px -1px',
      'rgba(0, 0, 0, 0.06) 0px 2px 8px -1px, rgba(0, 0, 0, 0.04) 0px 1px 2px 0px',
      'rgba(0, 0, 0, 0.08) 0px 4px 12px -2px, rgba(0, 0, 0, 0.04) 0px 1px 3px 0px',
      '0 8px 30px rgba(0, 0, 0, 0.5)',
      '0 8px 30px rgba(0, 0, 0, 0.5)',
      '0 8px 30px rgba(0, 0, 0, 0.5)',
      '0 8px 30px rgba(0, 0, 0, 0.5)',
      '0 8px 30px rgba(0, 0, 0, 0.5)',
      '0 8px 30px rgba(0, 0, 0, 0.5)',
      '0 8px 30px rgba(0, 0, 0, 0.5)',
      '0 8px 30px rgba(0, 0, 0, 0.5)',
      '0 8px 30px rgba(0, 0, 0, 0.5)',
      '0 8px 30px rgba(0, 0, 0, 0.5)',
      '0 8px 30px rgba(0, 0, 0, 0.5)',
      '0 8px 30px rgba(0, 0, 0, 0.5)',
      '0 8px 30px rgba(0, 0, 0, 0.5)',
      '0 8px 30px rgba(0, 0, 0, 0.5)',
      '0 8px 30px rgba(0, 0, 0, 0.5)',
      '0 8px 30px rgba(0, 0, 0, 0.5)',
      '0 8px 30px rgba(0, 0, 0, 0.5)',
    ],

    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: isDark ? '#0b0c0e' : '#f8fafc',
            color: isDark ? '#ffffff' : '#0f172a',
            fontFeatureSettings: '"ss01" on, "ss03" on',
          },
        },
      },

      MuiButton: {
        styleOverrides: {
          root: {
            minHeight: 38,
            borderRadius: 10,
            padding: '8px 20px',
            fontWeight: 450,
            fontSize: '14px',
            textTransform: 'none',
            letterSpacing: '-0.2px',
            transition: 'all 0.15s ease',
          },

          contained: {
            backgroundColor: isDark ? '#f2f2f2' : '#0f172a',
            color: isDark ? '#131416' : '#ffffff',
            boxShadow: '0 1px 4px rgba(0,0,0,0.1), 0 0 1px rgba(0,0,0,0.1)',
            '&:hover': {
              backgroundColor: isDark ? '#e5e5e5' : '#1e293b',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            },
            '&.Mui-disabled': {
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
              color: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.26)',
            },
          },

          outlined: {
            borderWidth: '0.5px !important',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.12) !important' : 'rgba(0, 0, 0, 0.12) !important',
            color: isDark ? '#ffffff' : '#0f172a',
            backgroundColor: 'transparent',
            '&:hover': {
              borderColor: isDark ? 'rgba(255, 255, 255, 0.25) !important' : 'rgba(0, 0, 0, 0.25) !important',
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
            },
          },

          text: {
            color: isDark ? 'rgba(255, 255, 255, 0.92)' : 'rgba(15, 23, 42, 0.92)',
            '&:hover': {
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
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
            borderRadius: 10,
            backgroundColor: isDark ? '#1f1f21' : '#ffffff',
            color: isDark ? '#ffffff' : '#0f172a',
            fontSize: '14px',
            '& fieldset': {
              borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.12)',
              borderWidth: '0.5px',
            },
            '&:hover fieldset': {
              borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.25)',
              borderWidth: '0.5px',
            },
            '&.Mui-focused fieldset': {
              borderColor: isDark ? '#3b82f6' : '#2563eb',
              borderWidth: '1px',
              boxShadow: isDark
                ? 'rgba(59, 130, 246, 0.25) 0px 0px 0px 1.5px'
                : 'rgba(37, 99, 235, 0.2) 0px 0px 0px 2px',
            },
            '& input::placeholder': {
              color: isDark ? '#9d9e9f' : '#94a3b8',
              opacity: 1,
            },
          },
        },
      },

      MuiInputLabel: {
        styleOverrides: {
          root: {
            fontSize: '13px',
            color: isDark ? '#858687' : '#64748b',
            '&.Mui-focused': {
              color: isDark ? '#60a5fa' : '#2563eb',
            },
          },
        },
      },

      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            backgroundColor: isDark ? '#131416' : '#ffffff',
            border: isDark ? '0.5px solid rgba(255, 255, 255, 0.07)' : '0.5px solid rgba(0, 0, 0, 0.08)',
            backgroundImage: 'none',
            boxShadow: isDark
              ? 'inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 0.5px rgba(255,255,255,0.07), 0 20px 44px rgba(0,0,0,0.14), 0 4px 10px rgba(0,0,0,0.08)'
              : '0 1px 3px rgba(0,0,0,0.05), 0 10px 25px -5px rgba(0,0,0,0.05)',
            transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
          },
        },
      },

      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? '#131416' : '#ffffff',
            backgroundImage: 'none',
          },
        },
      },

      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 5.26,
            fontWeight: 500,
            fontSize: '11px',
            letterSpacing: '-0.1px',
          },
          outlined: {
            borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
          },
          colorSuccess: {
            backgroundColor: isDark ? 'rgba(74, 222, 128, 0.1)' : 'rgba(22, 163, 74, 0.08)',
            color: isDark ? '#4ade80' : '#16a34a',
            borderColor: isDark ? '#4ade80' : 'rgba(22, 163, 74, 0.3)',
          },
          colorInfo: {
            backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(37, 99, 235, 0.08)',
            color: isDark ? '#60a5fa' : '#2563eb',
            borderColor: isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(37, 99, 235, 0.3)',
          },
          colorError: {
            backgroundColor: isDark ? 'rgba(248, 113, 113, 0.1)' : 'rgba(220, 38, 38, 0.08)',
            color: isDark ? '#f87171' : '#dc2626',
            borderColor: isDark ? 'rgba(248, 113, 113, 0.3)' : 'rgba(220, 38, 38, 0.3)',
          },
        },
      },

      MuiTableHead: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? '#131416' : '#f8fafc',
            '& .MuiTableCell-head': {
              color: isDark ? '#858687' : '#64748b',
              fontWeight: 500,
              fontSize: '11px',
              letterSpacing: '0.04rem',
              borderBottom: isDark ? '0.5px solid rgba(255, 255, 255, 0.07)' : '0.5px solid rgba(0, 0, 0, 0.08)',
              textTransform: 'uppercase',
              py: 1.5,
            },
          },
        },
      },

      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: isDark ? '0.5px solid rgba(255, 255, 255, 0.05)' : '0.5px solid rgba(0, 0, 0, 0.06)',
            color: isDark ? '#cececf' : '#334155',
            padding: '12px 16px',
            fontSize: '13px',
          },
        },
      },

      MuiTableRow: {
        styleOverrides: {
          root: {
            '&:hover': {
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03) !important' : 'rgba(0, 0, 0, 0.02) !important',
            },
          },
        },
      },

      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 16,
            backgroundColor: isDark ? '#131416' : '#ffffff',
            border: isDark ? '0.5px solid rgba(255, 255, 255, 0.08)' : '0.5px solid rgba(0, 0, 0, 0.08)',
            boxShadow: isDark ? '0 20px 44px rgba(0,0,0,0.5)' : '0 20px 44px rgba(0,0,0,0.12)',
          },
        },
      },

      MuiMenu: {
        styleOverrides: {
          paper: {
            borderRadius: 12,
            backgroundColor: isDark ? '#131416' : '#ffffff',
            border: isDark ? '0.5px solid rgba(255, 255, 255, 0.08)' : '0.5px solid rgba(0, 0, 0, 0.08)',
            boxShadow: isDark ? '0 16px 36px rgba(0,0,0,0.5)' : '0 10px 30px rgba(0,0,0,0.08)',
          },
        },
      },

      MuiMenuItem: {
        styleOverrides: {
          root: {
            fontSize: '13px',
            color: isDark ? '#cececf' : '#334155',
            borderRadius: 8,
            margin: '2px 6px',
            '&:hover': {
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)',
              color: isDark ? '#ffffff' : '#0f172a',
            },
            '&.Mui-selected': {
              backgroundColor: isDark ? 'rgba(59, 130, 246, 0.12)' : 'rgba(37, 99, 235, 0.08)',
              color: isDark ? '#3b82f6' : '#2563eb',
              '&:hover': {
                backgroundColor: isDark ? 'rgba(59, 130, 246, 0.18)' : 'rgba(37, 99, 235, 0.14)',
              },
            },
          },
        },
      },

      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            borderRadius: 5.26,
            fontSize: '11px',
            backgroundColor: isDark ? '#1f1f21' : '#0f172a',
            border: isDark ? '0.5px solid rgba(255, 255, 255, 0.1)' : '0.5px solid rgba(0, 0, 0, 0.1)',
            color: '#ffffff',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          },
        },
      },

      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.08)',
            borderWidth: '0.5px',
          },
        },
      },

      MuiIconButton: {
        styleOverrides: {
          root: {
            color: isDark ? '#858687' : '#64748b',
            '&:hover': {
              color: isDark ? '#ffffff' : '#0f172a',
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)',
            },
          },
        },
      },
    },
  });
};

const theme = getAppTheme('dark');

export default theme;