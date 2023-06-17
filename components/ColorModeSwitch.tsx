import { useColorMode, IconButton, Box } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

interface ColorModeSwitchProps {}

const ColorModeSwitch = ({}: ColorModeSwitchProps) => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box>
      {colorMode === 'light' ? (
        <IconButton
          aria-label="Toggle dark"
          icon={<MoonIcon />}
          onClick={toggleColorMode}
        />
      ) : (
        <IconButton
          aria-label="Toggle light"
          icon={<SunIcon />}
          onClick={toggleColorMode}
        />
      )}
    </Box>
  );
};

export default ColorModeSwitch;
