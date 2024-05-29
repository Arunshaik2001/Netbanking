import axios, { AxiosError } from "axios";
import Button from "../components/Button";
import TextFieldWithLabel from "../components/TextFieldWithLabel";
import { useRef, useState } from "react";
import Loader from "../components/Loader";
import { Id, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";

export default function Debit() {
  const passwordRef = useRef<HTMLInputElement>(null);
  const userIdAccountRef = useRef<HTMLInputElement>(null);

  const [showDebitButton, setShowDebitButton] = useState(false);
  const [loading, setLoading] = useState(false);
  let toastId = useRef<Id | undefined>(undefined);

  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };

  const query = useQuery();

  const getQueryParams = () => {
    const params: {
      [key: string]: string;
    } = {};

    for (let [key, value] of query.entries()) {
      params[key] = value;
    }
    return params;
  };

  const queryParams = getQueryParams();

  const validInputMap = useRef({
    accountNumber: "",
    password: "",
  });

  async function listenToTransaction(clientId: string) {
    const ws = new WebSocket(import.meta.env.VITE_HDFC_MAIN_SOCKET_SERVER!);

    ws.onopen = (event) => {
      console.log("Connection Opened: " + clientId);
      console.log("event: " + event.type);

      ws.send(
        JSON.stringify({
          type: "identifier",
          content: {
            data: {
              clientId: clientId,
            },
          },
        })
      );
    };

    ws.onmessage = (message) => {
      const txDetails = JSON.parse(message.data);
      console.log("Message received:", txDetails.paymntToken);
      if (queryParams.token == txDetails.paymntToken) {
        toast.dismiss();
        if (txDetails.status == "SUCCESS") {
          toastId.current = toast.success(
            "Successfylly Transferred Money. Closing Window."
          );
        } else {
          toastId.current = toast.error("Failed to Transfer Money.");
        }
        setLoading(false);
        ws.close();
        setTimeout(() => {
          window.close();
        }, 3000);
      }
    };

    ws.onclose = () => {
      console.log("closing connection");
      setLoading(false);
    };
  }

  async function createDebit() {
    if (
      validInputMap.current.accountNumber != "" &&
      validInputMap.current.password != ""
    ) {
      setLoading(true);
      try {
        const loginResponse = await axios.post(
          import.meta.env.VITE_HDFC_LOGIN_SERVER_URL!,
          {
            password: validInputMap.current.password,
            userId: validInputMap.current.accountNumber,
          },
          {
            withCredentials: true,
          }
        );

        console.log("------LoginResponse---------");

        console.log(loginResponse);

        const response = await axios.post(
          import.meta.env.VITE_HDFC_DEBIT_SERVER_URL!,
          {
            paymentAppToken: queryParams.token,
            netbankApp: queryParams.bankName,
            paymentApp: queryParams.paymentApp,
          },
          {
            withCredentials: true,
          }
        );

        toast.dismiss();
        if (loginResponse.status < 300) {
          toastId.current = toast.success(
            "Debit process started. Please wait...."
          );
          listenToTransaction(validInputMap.current.accountNumber);
        } else {
          toastId.current = toast.error(response.data.message);
        }
      } catch (error) {
        const err = error as AxiosError;
        toast.dismiss();
        if (err.response && err.response.data) {
          const { message } = err.response!.data! as { message: string };

          toastId.current = toast.error(JSON.stringify(message));
        } else {
          toastId.current = toast.error("Some Error Occurred");
        }
        setLoading(false);
      } finally {
      }
    }
  }

  function enableButton() {
    setShowDebitButton(
      validInputMap.current.accountNumber != "" &&
        validInputMap.current.password != ""
    );
  }

  const allImpQuery =
    queryParams.token && queryParams.bankName && queryParams.paymentApp;

  return (
    <div className="relative w-full h-screen flex justify-center items-center bg-slate-500 ">
      <ToastContainer />
      {loading && <Loader />}
      <div className="bg-white border-gray-500 p-[3%] rounded-lg flex flex-col justify-center items-center z-0">
        {allImpQuery ? (
          <>
            <div className="font-bold text-2xl pb-5">
              Debit from Netbanking Account
            </div>
            <TextFieldWithLabel
              label="Enter UserId"
              placeholderText="Enter User Id..."
              ref={userIdAccountRef}
              errorText="Please enter 7 digits user id."
              pattern="^\d{7,7}$"
              onValidText={(value) => {
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
                validInputMap.current.password = value;
                enableButton();
              }}
            />
            <Button
              label="Debit"
              onClick={() => {
                createDebit();
              }}
              enabled={showDebitButton}
            />
          </>
        ) : (
          <div>Please provide required query pramams to debit.</div>
        )}
      </div>
    </div>
  );
}
