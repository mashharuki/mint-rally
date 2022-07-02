import '../styles/globals.css'
import type { AppProps } from 'next/app'
import {ChakraProvider, extendTheme} from '@chakra-ui/react'

const theme = extendTheme({
  // デフォルトのフォント
  // https://chakra-ui.com/docs/theming/theme#typography
  fonts: {
  },
  // デフォルトのカラーモード
  // https://chakra-ui.com/docs/theming/theme#config
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  colors: {
    mint: {
      bg: "#56F0DE",
      front: "#552306"
    },
  }
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
    )
}

export default MyApp
