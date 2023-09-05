import './login.scss'
import {AnimatePresence, motion} from 'framer-motion';
import Logo from '../../../../public/vite.svg';
import Back from '../../../assets/icons/left-arrow-back-svgrepo-com.svg';
import {useRef, useState} from "react";
import {failAlert, successAlert} from "../../../swal/swal.ts"
import {useNavigate} from "react-router-dom";
import {
    isUserExist,
    loginWithPassword,
    sendVerifyEmailAuth,
    signInWithGoogle,
    signUpWithPassword
} from "../../../API/firebase/auth.ts";
import {addUser} from "../../../API/firebase/database.ts"

const validEmail = new RegExp(/^[a-zA-Z0-9.]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/);
const validPassword = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

function Login() {
    const emailRef = useRef(null);
    // modes - email | name | password
    const [showMode, setShowMode] = useState('email');
    // values
    const [emailValue, setEmailValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');
    const [nameValue, setNameValue] = useState('');
    const navigate = useNavigate();

    function handleBack() {
        setShowMode('email')
    }

    function validateEmail() {
        let currentShowMode = structuredClone(emailValue);
        return validEmail.test(currentShowMode);
    }

    function validatePassword() {
        let currentPasswordState = structuredClone(passwordValue);
        return validPassword.test(currentPasswordState);
    }

    async function handleContinue() {
        let currentShowMode = structuredClone(showMode);

        if (currentShowMode == 'email') {
            if (!emailRef.current) return;
            let isEmailValid = validateEmail();
            if (!isEmailValid) {
                (emailRef.current as HTMLInputElement).classList.add("horizontal-shake");
                return;
            }
            if (await isUserExist(emailValue)) {
                setShowMode('password')
            } else {
                setShowMode('name')
            }
        } else if (currentShowMode == 'password') {
            let isPasswordValid = validatePassword();
            if (isPasswordValid) {
                await loginWithPassword(emailValue, passwordValue).then(async (res) => {
                    if (!res.emailVerified) {
                        let resend = confirm("Verify your Email to Login. You want to resend verification email? Click Ok or cancel otherwise.")
                        if (resend) {
                            await sendVerifyEmailAuth();
                            successAlert('Email Sent', "Verification mail sent successfully.", 5000)
                        }
                        return
                    }
                    await addUser(res).then(() => {
                        navigate('/home');
                        successAlert('Login', 'successfully logged in');
                    }).catch((err) => {
                        failAlert("Login Failed", err.message)
                    })
                }).catch((err) => {
                    failAlert("Login Failed", err.message)
                })

            } else {
                failAlert('Error', 'Please follow the format of minimum 8 characters with 1 Capital Letter, 1 number and 1 special character', 5000);
            }
        } else if (currentShowMode == 'name') {
            let currentNameState = structuredClone(nameValue);
            let isNameValid = currentNameState.length > 0;
            if (isNameValid) {
                let isPasswordValid = validatePassword();
                if (isPasswordValid) {
                    await signUpWithPassword(emailValue, passwordValue, nameValue).then(async () => {
                        await sendVerifyEmailAuth();
                        successAlert('Account Created Successfully', 'Verification Email is sent to your email, please verify to continue.', 5000)
                        setEmailValue('')
                        setPasswordValue('')
                        setNameValue('')
                        setShowMode('email')
                    }).catch((err) => {
                        failAlert("Account is not created", err.message)
                    })
                } else {
                    failAlert('Error', 'Please follow the format of minimum 8 characters with 1 Capital Letter, 1 number and 1 special character', 5000);
                }
            } else {
                failAlert('Error', 'Name is required field!');
            }
        }
    }

    function getValueEmail(e: any) {
        let currentEmailValue = e.target.value
        setEmailValue(currentEmailValue)
    }

    function getValuePassword(e: any) {
        let currentPasswordValue = e.target.value
        setPasswordValue(currentPasswordValue)
    }

    function getValueName(e: any) {
        let currentNameValue = e.target.value
        setNameValue(currentNameValue)
    }

    async function handleSignInWithGoogle() {
        await signInWithGoogle().then(async (res) => {
            await addUser(res).then(() => {
                navigate('/home');
                successAlert('Login', 'successfully logged in');
            }).catch((err) => {
                failAlert("Login Failed", err.message)
            })
        }).catch((err) => {
            failAlert("Login Failed", err.message)
        })
    }

    return (
        <>
            <div className="bg-white">
                <div className="flex min-h-screen overflow-hidden">
                    <div className="flex flex-row w-full">
                        <div
                            className='hidden lg:flex flex-col justify-between bg-light dark:bg-dark lg:p-8 xl:p-12 lg:max-w-sm xl:max-w-lg'>
                            <div className="flex items-center justify-start content-center space-x-3">
                            <span className="rounded-full w-12 h-12 flex items-center justify-start content-center">
                                <img src={Logo} alt=''/>
                            </span>
                                <a className="font-medium text-3xl titleFont uppercase">Confidential Buzz</a>
                            </div>
                            <div className='space-y-5'>
                                <h1 className="lg:text-2xl xl:text-4xl xl:leading-snug titleFont font-extrabold">Elevating the Voices of Your Friends with Uncompromised Security on Confidential Buzz.</h1>
                            </div>
                            <p className="font-medium"></p>
                        </div>
                        <div className="flex flex-1 flex-col items-center justify-center relative bg-chat">
                            <div
                                className="flex lg:hidden justify-between items-center w-full py-4 px-10 bg-light dark:bg-dark">
                                <div className="flex items-center justify-start content-center space-x-3">
                            <span className="rounded-full w-12 h-12 flex items-center justify-start content-center">
                                <img src={Logo} alt=''/>
                            </span>
                                    <a className="font-medium text-2xl">Confidential Buzz</a>
                                </div>
                            </div>
                            <div className="flex flex-1 flex-col justify-center max-w-screen-md px-10">
                                <div className="glass-box">
                                    <div className="flex flex-col">
                                        {showMode == 'email' &&
                                            <>
                                                <div>
                                                    <h2 className="text-3xl md:text-4xl font-bold text-dark">Sign
                                                        in to
                                                        account</h2>
                                                    <p className="text-md md:text-xl text-dark">Sign up or log in
                                                        to place to chit
                                                        chat with others!</p>
                                                </div>
                                            </>
                                        }
                                        {showMode == 'password' &&
                                            <div>
                                                <div className="inline-block">
                                                    <span
                                                        className="text-l md:text-xl font-bold flex flex-row gap-1 items-center cursor-pointer text-dark"
                                                        onClick={() => handleBack()}><span
                                                        className="rounded-full w-6 h-6 flex items-center justify-start content-center text-dark"><i><img
                                                        alt='' src={Back}/></i></span><h2
                                                        className="text-dark">Go Back</h2></span>
                                                </div>
                                                <h2 className="text-3xl md:text-4xl font-bold text-dark">Welcome
                                                    back !</h2>
                                                <p className="text-md md:text-xl text-dark">Sign up or log in to
                                                    place to chit
                                                    chat with others!</p>

                                            </div>
                                        }
                                        {showMode == 'name' &&
                                            <div>
                                                <div className="inline-block">
                                                    <motion.span whileHover={{scale: 1.05}}
                                                                 transition={{
                                                                     type: "spring",
                                                                     stiffness: 400,
                                                                     damping: 10
                                                                 }}
                                                                 className="text-l md:text-xl font-bold flex flex-row gap-1 items-center cursor-pointer"
                                                                 onClick={() => handleBack()}><span
                                                        className="rounded-full w-6 h-6 flex items-center justify-start content-center"><i><img
                                                        alt='' src={Back}/></i></span><h2 className="text-dark">Go
                                                        Back</h2></motion.span>
                                                </div>
                                                <h2 className="text-3xl md:text-4xl font-bold text-dark">Sign Up
                                                    Now !</h2>
                                                <p className="text-md md:text-xl text-dark">Sign up or log in to
                                                    place to chit
                                                    chat with others!</p>

                                            </div>
                                        }
                                    </div>
                                    <div className="flex flex-col max-w-screen-md relative">
                                        <AnimatePresence>
                                            {showMode == 'email' &&
                                                <motion.input type="text" placeholder="Email" value={emailValue}
                                                              autoComplete="off"
                                                              onChange={() => {
                                                                  getValueEmail(event)
                                                              }} ref={emailRef}
                                                              onAnimationEnd={(e) => (e.target as HTMLInputElement).classList.remove('horizontal-shake')}
                                                              initial={{x: '100%', opacity: 1, position: 'absolute'}}
                                                              animate={{x: 0, opacity: 1, position: 'initial'}}
                                                              exit={{x: '100%', opacity: "0", position: "absolute"}}
                                                              transition={{bounce: 0}}
                                                              className='mt-5 flex px-3 py-2 md:px-4 md:py-3 border-2 border-black rounded-lg font-medium placeholder:font-normal text-dark'/>
                                            }
                                        </AnimatePresence>
                                        <AnimatePresence>
                                            {showMode == 'name' &&
                                                <motion.input type="text" placeholder="Full Name" autoComplete="off"
                                                              value={nameValue} onChange={() => {
                                                    getValueName(event)
                                                }} transition={{bounce: 0}}

                                                              initial={{x: '-100%', opacity: 0, position: 'absolute'}}
                                                              animate={{x: 0, opacity: 1, position: 'initial'}}
                                                              className="mt-5 flex px-3 py-2 md:px-4 md:py-3 border-2 border-black rounded-lg font-medium placeholder:font-normal text-dark"/>
                                            }
                                        </AnimatePresence>
                                        <AnimatePresence>
                                            {(showMode == 'password' || showMode == 'name') &&
                                                <motion.input type="password" placeholder="Password" autoComplete="off"
                                                              value={passwordValue} onChange={() => {
                                                    getValuePassword(event)
                                                }} transition={{bounce: 0}}

                                                              initial={{x: '-100%', opacity: 0, position: 'absolute'}}
                                                              animate={{x: 0, opacity: 1, position: 'initial'}}
                                                              className="mt-5 flex px-3 py-2 md:px-4 md:py-3 border-2 border-black rounded-lg font-medium placeholder:font-normal text-dark"/>
                                            }
                                        </AnimatePresence>
                                        <button
                                            className="flex mt-5 items-center justify-center flex-none px-3 py-2 md:px-4 md:py-3 border-2 rounded-lg font-medium border-black bg-black relative text-white"
                                            onClick={() => handleContinue()}>
                                            Continue
                                        </button>
                                        <div className="flex justify-center items-center my-5">
                                            <span className="w-full border border-black"></span>
                                            <span className="px-4 font-bold text-dark">Or</span>
                                            <span className="w-full border border-black"></span>
                                        </div>
                                        <button onClick={() => handleSignInWithGoogle()}
                                                className="bg-black flex items-center justify-center flex-none px-3 py-2 md:px-4 md:py-3 border-2 rounded-lg font-medium border-black relative">
                                          <span className="absolute left-4">
                                              <svg width="24px" height="24px" viewBox="0 0 24 24"
                                                   xmlns="http://www.w3.org/2000/svg">
                                              <path fill="#EA4335 "
                                                    d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"/>
                                              <path fill="#34A853"
                                                    d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"/>
                                              <path fill="#4A90E2"
                                                    d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"/>
                                              <path fill="#FBBC05"
                                                    d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"/>
                                          </svg>
                                          </span>
                                            <span className="text-white">Sign in with Google</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

export default Login;
