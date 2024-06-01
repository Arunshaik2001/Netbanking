import axios, { AxiosError } from "axios";
import Button from "../components/Button";
import TextFieldWithLabel from "../components/TextFieldWithLabel";
import { useRef, useState } from "react";
import Loader from "../components/Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Create() {
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const bankAccountRef = useRef<HTMLInputElement>(null);

  const [password, setPassword] = useState("");
  const [showPasswordError, setShowPasswordError] = useState(false);
  const [showCreateButton, setShowCreateButton] = useState(false);
  const [loading, setLoading] = useState(false);
  const [netbankId, setNetbankId] = useState("");

  const inputMap = useRef({
    accountNumber: "",
    password: "",
    confirmPassword: "",
  });

  const validInputMap = useRef({
    accountNumber: "",
    password: "",
    confirmPassword: "",
  });

  async function createUser() {
    if (
      validInputMap.current.accountNumber != "" &&
      validInputMap.current.password != "" &&
      validInputMap.current.confirmPassword != ""
    ) {
      setLoading(true);
      try {
        const response = await axios.post(
          import.meta.env.VITE_HDFC_CREATE_SERVER_URL!,
          {
            accountNumber: validInputMap.current.accountNumber,
            password: validInputMap.current.password,
            bankName: "HDFC",
          }
        );

        if (response.status < 300) {
          const userId = response.data.userId;
          setNetbankId(userId);
          toast.success("Created netbanking User Id");
        }
      } catch (error) {
        console.log(error);
        const err = error as AxiosError;

        const { message } = err.response!.data! as { message: string };
        toast.error(message);
      } finally {
        setLoading(false);
      }
    }
  }

  function enableButton() {
    setShowCreateButton(
      validInputMap.current.accountNumber != "" &&
        validInputMap.current.password != "" &&
        validInputMap.current.confirmPassword != ""
    );
  }

  return (
    <div className="relative w-full h-screen flex justify-center items-center bg-slate-500 ">
      <ToastContainer />
      {loading && <Loader />}
      <div className="bg-white border-gray-500 p-[3%] rounded-lg flex flex-col justify-center items-center z-0">
        <div className="font-bold text-2xl pb-5">Create Netbanking Account</div>
        <TextFieldWithLabel
          label="Enter Bank Account Number"
          placeholderText="Dummy account: 4561234"
          ref={bankAccountRef}
          errorText="Please enter 7 digits bank account number."
          pattern="^\d{7,7}$"
          onValidText={(value) => {
            inputMap.current.accountNumber = value;
            validInputMap.current.accountNumber = value;
            enableButton();
          }}
        />
        <TextFieldWithLabel
          label="Enter Password"
          placeholderText="Enter Password..."
          ref={passwordRef}
          errorText="Please enter password minimum 6 length."
          type="password"
          pattern="^[A-Za-z0-9]{6,}$"
          onValidText={(value) => {
            console.log(value);
            setPassword(value);
            inputMap.current.password = value;
            validInputMap.current.password = value;

            if (inputMap.current.confirmPassword != "") {
              if (value !== inputMap.current.confirmPassword) {
                setShowPasswordError(true);
                inputMap.current.confirmPassword = "";
                validInputMap.current.confirmPassword = "";
              }
            }
            enableButton();
          }}
        />
        <TextFieldWithLabel
          label="Confirm Password"
          placeholderText="Confirm Password..."
          ref={confirmPasswordRef}
          errorText="Please match with password."
          type="password"
          pattern={password}
          onValidText={(value) => {
            validInputMap.current.confirmPassword = value;
            setShowPasswordError(false);
            enableButton();
          }}
          onTextChange={(value) => {
            inputMap.current.confirmPassword = value;
          }}
          showError={showPasswordError}
        />
        <Button
          label="Create"
          onClick={() => {
            createUser();
          }}
          enabled={showCreateButton}
        />
        {netbankId && (
          <div
            className={`font-bold text-2xl py-5 ${
              netbankId ? "animate-slideUp" : ""
            }`}
          >
            Your Netbanking Id is: {netbankId}
          </div>
        )}
      </div>
    </div>
  );
}
