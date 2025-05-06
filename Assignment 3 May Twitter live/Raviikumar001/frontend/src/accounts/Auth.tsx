import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import LoadingComponent from "../components/LoadingComponent";
import MessageComponent from "../components/MessageComponent";
import { registerStart,registerSuccess, registerFailure,loginStart,loginSuccess,loginFailure 
,defaultState
} from "../store/slices/authSlice";
import { Link } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
type VARIENT = "LOGIN" | "REGISTER";

const Auth: React.FC = () => {
  const [Varient, setVarient] = useState<VARIENT>("LOGIN");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch(); 
  const { error,loading } = useSelector((state: RootState) => state.auth);

  let navigate = useNavigate();
  const toggleVarient = useCallback(() => {
    if (Varient === "LOGIN") {
      setEmail("");
      setPassword("");
      setVarient("REGISTER");
      dispatch(defaultState())

    } else {
      setEmail("");
      setPassword("");
      setVarient("LOGIN");
      dispatch(defaultState())

    }
  }, [Varient]);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const authApi = Varient === "LOGIN" ?"/v1/auth/login" : "/v1/auth/register"  ;
    const dispatchAction = Varient === "LOGIN" ? loginStart : registerStart;

    if((email || password) ==='')
    {
      dispatch(loginFailure("Fielda are empty !"));
      return;
    }else if(password.length<4)
    {
      dispatch(loginFailure("Password should be greater than 3 chars"));
      return;
    }

    try {
      dispatch(dispatchAction())




      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}${authApi}`,{
        email,
        password
      })

      console.log(response);
      if(response)
      {   
         if (Varient === 'REGISTER'){
          const user = response.data?.user;
          const token = response.data?.token.replace(/"/g, '');
          dispatch(registerSuccess({user,token}));
          navigate('/app');
         }else if(Varient == 'LOGIN')
         {
            const user = response.data?.user;
          const token = response.data?.token.replace(/"/g, '');
      
          dispatch(loginSuccess({user,token}))
          navigate('/app');
         }

      }
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      console.log(error)
      if (err.response) { 
        if (Varient === 'REGISTER'){
          const message = err.response?.data?.message;
         dispatch(registerFailure(message))
        }else if(Varient == 'LOGIN')
        {
          const message = err.response?.data?.message;
         dispatch(loginFailure(message))
        }
    
      }
    }
  };



  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center">
          <h2 className="text-3xl font-extrabold text-[#6420AA]">PhotoUp</h2>
        </Link>
        
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {Varient === "LOGIN" ? "Welcome back" : "Create your account"}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {Varient === "LOGIN" ? "Sign in to your account" : "Join PhotoUp today"}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={(e) => handleSubmit(e)}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#6420AA] focus:border-[#6420AA] sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#6420AA] focus:border-[#6420AA] sm:text-sm"
                />
              </div>
            </div>

            {loading && <LoadingComponent message={Varient === "LOGIN" ? "Authenticating" : "Creating User"} />}
            {error && <MessageComponent message={error} />}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#6420AA] hover:bg-[#5a1d99] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6420AA] transition-colors duration-200 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {Varient === "LOGIN" ? "Sign in" : "Create account"}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  {Varient === "LOGIN" ? "New to PhotoUp?" : "Already have an account?"}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={toggleVarient}
                className="w-full flex justify-center py-2 px-4 border border-[#6420AA] rounded-md shadow-sm text-sm font-medium text-[#6420AA] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6420AA] transition-colors duration-200 ease-in-out"
              >
                {Varient === "LOGIN" ? "Create new account" : "Sign in to existing account"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
