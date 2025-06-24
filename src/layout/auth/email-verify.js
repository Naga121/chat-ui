import { useEffect, useState } from "react";
import Styles from "./verify.module.css";
import Login from "./login/login";
import { useParams } from "react-router-dom";
import { verifyEmailApi } from "../../api-calls/auth";


const EmailVerify = () => {
    const [validUrl, setValidUrl] = useState(false);
    const param = useParams();

    useEffect(()=>{
        const verifyEmailUrl = async ()=>{
            try { 
                const {data} = await verifyEmailApi(param.token);
                console.log(data);
                
            } catch (error) {
                console.log(error);
            }
        }
    },[param]);


    return (
        <>
            {validUrl ?
                (<div className={Styles.container}>
                    <img src="" alt="Success_img" className={Styles.green_btn}/>
                    <h2>Email verified successfully</h2>
                    <Login to="/login}">
                        <button type="button" className={Styles.green_btn} Login></button>
                    </Login>
                </div>) :
                (<div>
                    <h2>404 Not Found</h2>
                </div>)
            }
        </>
    )
}

export default EmailVerify;