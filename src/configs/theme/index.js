import { createMuiTheme } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
const mainColor = purple[500];


export default createMuiTheme({
  palette: {
    primary: {
      main: mainColor,
      light: '#F71CDB',
      dark: '#5G0FF',
      contrastText: '#FFF',
    },
    secondary: {
      main: '#DA005F',
      light: '#F173AA',
      dark: '#A20047',
      contrastText: '#FFF',
    },
    textColor: {
      gray: '#BBB',
      gray2: '#7d7d7d',
    },
    success: {
      main: '#00ff00',
    },
    info: {
      main: '#30bcec',
    },
    warning: {
      main: '#fdb31b',
    },
    danger: {
      main: '#ff0000',
    },
  }
})