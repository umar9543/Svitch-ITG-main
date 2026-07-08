import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme, keyframes } from '@mui/material/styles';

const float1 = keyframes`
  0%, 100% { transform: translate(0, 0); }
  25% { transform: translate(6px, -8px); }
  50% { transform: translate(-4px, 5px); }
  75% { transform: translate(8px, 3px); }
`;

const float2 = keyframes`
  0%, 100% { transform: translate(0, 0); }
  25% { transform: translate(-5px, 6px); }
  50% { transform: translate(7px, -4px); }
  75% { transform: translate(-3px, -7px); }
`;

const float3 = keyframes`
  0%, 100% { transform: rotate(40deg) translate(0, 0); }
  25% { transform: rotate(42deg) translate(5px, -6px); }
  50% { transform: rotate(38deg) translate(-6px, 4px); }
  75% { transform: rotate(41deg) translate(4px, 7px); }
`;

const float4 = keyframes`
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(8px, -5px) scale(1.04); }
  66% { transform: translate(-6px, 6px) scale(0.96); }
`;

// ----------------------------------------------------------------------

export default function AppWelcome({ title, description, action, img, ...other }) {
  const theme = useTheme();

  return (
    <Stack
      flexDirection={{ xs: 'column', md: 'row' }}
      sx={{
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.lighter, 0.48)} 0%, ${alpha(theme.palette.primary.light, 0.24)} 50%, ${alpha(theme.palette.primary.main, 0.24)} 100%)`,
        backgroundColor: alpha(theme.palette.primary.lighter, 0.12),
        height: { md: 1 },
        borderRadius: 2,
        position: 'relative',
        overflow: 'hidden',
        color: theme.palette.primary.darker,
      }}
      {...other}
    >
      {/* Decorative shapes */}
      <Box
        sx={{
          position: 'absolute',
          top: -40,
          right: -20,
          width: 160,
          height: 160,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.24)} 0%, ${alpha(theme.palette.primary.dark, 0.16)} 100%)`,
          animation: `${float1} 8s ease-in-out infinite`,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: 60,
          right: 60,
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.18)} 0%, ${alpha(theme.palette.primary.light, 0.12)} 100%)`,
          animation: `${float2} 10s ease-in-out infinite`,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -30,
          right: 140,
          width: 120,
          height: 120,
          borderRadius: 3,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.16)} 0%, ${alpha(theme.palette.primary.dark, 0.08)} 100%)`,
          animation: `${float3} 12s ease-in-out infinite`,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -20,
          left: '40%',
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.16)} 0%, transparent 100%)`,
          animation: `${float4} 9s ease-in-out infinite`,
        }}
      />

      <Stack
        flexGrow={1}
        justifyContent="center"
        alignItems={{ xs: 'center', md: 'flex-start' }}
        sx={{
          p: {
            xs: theme.spacing(5, 3, 0, 3),
            md: theme.spacing(5),
          },
          textAlign: { xs: 'center', md: 'left' },
          zIndex: 1,
        }}
      >
        <Typography variant="h4" sx={{ mb: 2, whiteSpace: 'pre-line' }}>
          {title}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            opacity: 0.8,
            maxWidth: 360,
            mb: { xs: 3, xl: 5 },
          }}
        >
          {description}
        </Typography>

        {action && action}
      </Stack>

      {img && (
        <Stack
          component="span"
          justifyContent="center"
          sx={{
            p: { xs: 5, md: 3 },
            maxWidth: 360,
            mx: 'auto',
            zIndex: 1,
          }}
        >
          {img}
        </Stack>
      )}
    </Stack>
  );
}

AppWelcome.propTypes = {
  img: PropTypes.node,
  action: PropTypes.node,
  title: PropTypes.string,
  description: PropTypes.string,
};
