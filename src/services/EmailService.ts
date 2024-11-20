import axios from "axios";

const BASE_URL = "http://localhost:4401/api/confirm";

export const sendConfirmationEmail = async (email: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/send-confirmation-email`, {
      email,
    });
    return response.data.message;
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    throw new Error("Email confirmation failed.");
  }
};

export const confirmEmail = async (email: string, confirmationCode: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/confirm-email`, {
      email,
      confirmationCode,
    });
    return response.data.message;
  } catch (error) {
    console.error("Error confirming email:", error);
    throw new Error("Email confirmation failed.");
  }
};
