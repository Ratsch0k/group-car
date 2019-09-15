import React from 'react';
import AppBar from "@material-ui/core/AppBar";
import './App.css';
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { createStyles, Theme, makeStyles} from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu"
import EmojiTransportationIcon from '@material-ui/icons/EmojiTransportation';
import IconButton from "@material-ui/core/IconButton";
import Avatar from "./Avatar";

const useStyles = makeStyles({
        root: {
            flexGrow: 1,
            textAlign: "left",
        },
        toolbarIcon: {
            fontSize: 40,
        },
        title: {
            flexGrow: 1,
        }
});

const theme = createMuiTheme({
    palette: {
        primary: {
            main: "#00C68A",
            light: "#98F0D6",
            dark: "#00A473",
            contrastText: "#FFFFFF"
        },
        secondary: {
            main: "#AD00D8",
            light: "#ECA1FF",
            dark: "#8900AB",
            contrastText: "#FFFFFF"
        }
    }
});

const App: React.FC = () => {
    const classes = useStyles();

    return (
        <ThemeProvider theme={theme}>
           <div className="App">
             <AppBar>
              <Toolbar className={classes.root}>
                  <Typography className={classes.title} variant="h4">Group Car</Typography>
                  <Avatar iconName={classes.toolbarIcon} />
                  <IconButton color="inherit"><EmojiTransportationIcon className={classes.toolbarIcon}/></IconButton>
                  <IconButton color="inherit"><MenuIcon className={classes.toolbarIcon} /></IconButton>
              </Toolbar>
             </AppBar>
           </div>
        </ThemeProvider>
    );
};

export default App;
