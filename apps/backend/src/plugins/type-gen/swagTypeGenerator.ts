import { writeFileSync } from "fs"
import AdmZip from "adm-zip"

export const swaggerSpecGenerator = async () => {
  const spec = await fetch(
    `http://localhost:${process.env.SERVER_PORT}/swagger/json`
  ).then(async (res) => await res.json())
  writeFileSync("./swagger-spec.json", JSON.stringify(spec))

  // Throw the spec.json into swagger.io online generator
  const codegenRequest = await fetch(
    "https://generator3.swagger.io/api/generate",
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        spec: JSON.stringify(spec),
        lang: "typescript-fetch",
        type: "CLIENT",
        codegenVersion: "V3",
        options: {
          supportsES6: true,
          withInterfaces: true,
          modelPropertyNaming: "original",
        },
      }),
    }
  )

  // Extract the zip file and save it to the utils folder
  const blob = await codegenRequest.blob()
  const reader = Buffer.from(await blob.arrayBuffer())
  const zip = new AdmZip(reader)
  zip.getEntries().forEach((entry) => {
    zip.extractEntryTo(
      entry.entryName,
      "../frontend/utils/swagger",
      false,
      true
    )
  })

  console.log("🦊 Swagger spec is saved.")
}
