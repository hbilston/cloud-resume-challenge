const { app } = require("@azure/functions");
const { TableClient } = require("@azure/data-tables");

app.http("GetVisitorCount", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    const connectionString =
      process.env.STORAGE_CONNECTION_STRING ||
      process.env.AzureWebJobsStorage;

    if (!connectionString) {
      return {
        status: 500,
        jsonBody: { error: "Storage connection string not configured" }
      };
    }

    const tableName = "visitorcounter";
    const partitionKey = "counter";
    const rowKey = "site";

    const client = TableClient.fromConnectionString(
      connectionString,
      tableName
    );

    await client.createTable().catch(() => {});

    let count = 1;

    try {
      const entity = await client.getEntity(partitionKey, rowKey);
      count = Number(entity.count) + 1;
      entity.count = count;
      await client.updateEntity(entity, "Replace");
    } catch {
      await client.createEntity({
        partitionKey,
        rowKey,
        count
      });
    }

    return {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      jsonBody: { count }
    };
  }
});