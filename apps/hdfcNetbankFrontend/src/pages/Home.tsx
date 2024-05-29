export default function Home() {
  return (
    <div className="w-full h-screen flex justify-center items-center bg-slate-500">
      <div className="bg-white p-[5%] rounded-lg flex flex-col justify-center items-center">
        <div className="text-2xl font-bold">
          This home route is not supported.
        </div>
        <br />
        <div className="text-xl font-semibold">
          This is a mock Netbanking App.
        </div>
        <div className="text-lg font-light">
          It doesn't support actual transfers. This is only for Paymnt App
          acting as Bank Frontend to OnRamp and OffRamp fake money.
        </div>
        <div className="text-sm font-regular py-5">
          Only /debit , /create and /registerApp are working
        </div>
      </div>
    </div>
  );
}
