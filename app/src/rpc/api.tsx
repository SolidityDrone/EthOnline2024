
const submitAction = async (transition: string, payload: any) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_STACKR_URL}/${transition}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return response.json();
};

const fetchInfo = async () => {
  try {
    const url = `${process.env.NEXT_PUBLIC_STACKR_URL}/info`;
    console.log("Fetching from URL:", url);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch info: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching info:", error);
    throw error;
  }
};
export { submitAction, fetchInfo };