import React, {useState} from "react";
import Input from "@material-ui/core/Input";
import TextField from "@material-ui/core/TextField";
import LoginForm from "../LoginForm";
import SignUpForm from "../SignUpForm";



const Authentication: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);

    return(
        <form noValidate>
            <TextField
                placeholder="Username"/>
        </form>
    );
};

export default Authentication;