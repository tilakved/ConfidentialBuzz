import './login.scss'
import {AnimatePresence, motion} from 'framer-motion';
import Logo from '../../../../public/vite.svg';
import Back from '../../../assets/icons/left-arrow-back-svgrepo-com.svg';
import {useRef, useState} from "react";
import {failAlert, successAlert} from "../../../swal/swal.ts"

const validEmail = new RegExp(/^[a-zA-Z0-9.]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/);
const validPassword = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

function Login() {
    const emailRef = useRef();
    const [showEmail, setShowEmail] = useState(true);
    const [emailValue, setEmailValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');

    function handleBack() {
        setShowEmail(true)
    }

    function validateEmail() {
        let currentEmailState = structuredClone(emailValue);
        if (validEmail.test(currentEmailState)) {
            return true;
        } else {
            console.log('wrong email', validEmail.test(currentEmailState))
            return false;
        }
    }

    function validatePassword() {
        let currentPasswordState = structuredClone(passwordValue);
        if (validPassword.test(currentPasswordState)) {
            return true;
        } else {
            console.log('wrong password', validPassword.test(currentPasswordState))
            return false;
        }
    }

    function handleContinue() {
        let currentEmailState = structuredClone(showEmail);
        let isEmailValid = validateEmail();
        if (!isEmailValid) {
            emailRef.current.classList.add("horizontal-shake")
            setTimeout(() => {
                emailRef.current.classList.remove('horizontal-shake')
            }, 500)
        }
        if (currentEmailState && isEmailValid) {
            setShowEmail(false)
        } else {
            let isPasswordValid = validatePassword();
            if (!currentEmailState) {
                if (isPasswordValid) {
                    console.log('all validated call API here')
                    successAlert('Login', 'successfully logged in'); //add to api
                } else {
                    failAlert('error', 'Please follow the format of 1 Capital Letter, 1 number and 1 special character', 5000);
                }
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

    return (
        <>
            <div className="bg-white">
                <div className="flex min-h-screen overflow-hidden">
                    <div className="flex flex-row w-full">
                        <div
                            className='hidden lg:flex flex-col justify-between bg-[#ffe85c] lg:p-8 xl:p-12 lg:max-w-sm xl:max-w-lg'>
                            <div className="flex items-center justify-start content-center space-x-3">
                            <span className="rounded-full w-12 h-12 flex items-center justify-start content-center">
                                <img src={Logo} alt=''/>
                            </span>
                                <a className="font-medium text-3xl titleFont">Confidential Buzz</a>
                            </div>
                            <div className='space-y-5'>
                                <h1 className="lg:text-2xl xl:text-4xl xl:leading-snug font-extrabold">Elevating the
                                    Voices of Your Friends with Uncompromised Security on Confidential Buzz.</h1>
                            </div>
                            <p className="font-medium"></p>
                        </div>

                        <div className="flex flex-1 flex-col items-center justify-center px-10 relative bg-chat">
                            <div className="flex lg:hidden justify-between items-center w-full py-4">
                                <div className="flex items-center justify-start content-center space-x-3">
                            <span className="rounded-full w-12 h-12 flex items-center justify-start content-center">
                                <img src={Logo} alt=''/>
                            </span>
                                    <a className="font-medium text-2xl">Confidential Buzz</a>
                                </div>
                            </div>
                            <div className="flex flex-1 flex-col justify-center max-w-screen-md">
                                <div className="glass-box">
                                    <div className="flex flex-col">
                                        {showEmail &&
                                            <>
                                                <div>
                                                    <h2 className="text-3xl md:text-4xl font-bold">Sign in to
                                                        account</h2>
                                                    <p className="text-md md:text-xl">Sign up or log in to place the
                                                        order, no password
                                                        require!</p>
                                                </div>
                                            </>
                                        }
                                        {!showEmail &&
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
                                                        alt='' src={Back}/></i></span><h2>Go Back</h2></motion.span>
                                                </div>
                                                <h2 className="text-3xl md:text-4xl font-bold">Welcome back !</h2>
                                                <p className="text-md md:text-xl">Sign up or log in to place the order,
                                                    no password
                                                    require!</p>

                                            </div>
                                        }


                                    </div>
                                    <div className="flex flex-col max-w-screen-md mt-5 relative">
                                        <AnimatePresence>
                                            {showEmail &&
                                                <motion.input type="text" placeholder="Email" value={emailValue}
                                                              onChange={() => {
                                                                  getValueEmail(event)
                                                              }} ref={emailRef}
                                                              initial={{x: '100%', opacity: 1, position: 'absolute'}}
                                                              animate={{x: 0, opacity: 1, position: 'initial'}}
                                                              exit={{x: '100%', opacity: "0", position: "absolute"}}
                                                              className='flex px-3 py-2 md:px-4 md:py-3 border-2 border-black rounded-lg font-medium placeholder:font-normal'/>
                                            }
                                        </AnimatePresence>
                                        <AnimatePresence>
                                            {!showEmail &&

                                                <motion.input type="password" placeholder="Password"
                                                              value={passwordValue} onChange={() => {
                                                    getValuePassword(event)
                                                }}
                                                              initial={{x: '-100%', opacity: 0, position: 'absolute'}}
                                                              animate={{x: 0, opacity: 1, position: 'initial'}}
                                                              className=" flex px-3 py-2 md:px-4 md:py-3 border-2 border-black rounded-lg font-medium placeholder:font-normal"/>

                                            }
                                        </AnimatePresence>
                                        <button
                                            className="flex mt-5 items-center justify-center flex-none px-3 py-2 md:px-4 md:py-3 border-2 rounded-lg font-medium border-black bg-black text-white"
                                            onClick={() => handleContinue()}>
                                            Continue
                                        </button>
                                        <div className="flex justify-center items-center my-5">
                                            <span className="w-full border border-black"></span>
                                            <span className="px-4">Or</span>
                                            <span className="w-full border border-black"></span>
                                        </div>
                                        <button
                                            className="flex items-center justify-center flex-none px-3 py-2 md:px-4 md:py-3 border-2 rounded-lg font-medium border-black relative">
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
                                            <span>Sign in with Google</span>
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
