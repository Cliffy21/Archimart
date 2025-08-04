import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PayPalButton = ({ amount, onSuccess }) => {
  return (
    <PayPalScriptProvider
      options={{ "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID }}
    >
      <PayPalButtons
        style={{ layout: "vertical" }}
        createOrder={(_data, actions) => {
          return actions.order.create({
            purchase_units: [{ amount: { value: amount.toFixed(2) } }],
          });
        }}
        onApprove={async (_data, actions) => {
          const details = await actions.order.capture();
          onSuccess(details); // Pass transaction details to parent callback
        }}
        onError={(error) => {
          console.error("PayPal Checkout Error:", error); // Handle errors gracefully
        }}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalButton;
