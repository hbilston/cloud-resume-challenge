document.addEventListener("DOMContentLoaded", async () => {
  const countEl = document.getElementById("count");

  try {
    const response = await fetch(
      https://resumefunctionapp-ahhbbyayd7csf4e6.australiaeast-01.azurewebsites.net/api/GetVisitorCount
    );

    const data = await response.json();

    // If your function returns { count: number }
    countEl.innerText = data.count ?? data;

  } catch (error) {
    console.error("Error fetching visitor count:", error);
    countEl.innerText = "Error";
  }
});