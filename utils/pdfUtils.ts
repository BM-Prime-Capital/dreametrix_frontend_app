/**
 * Utility functions for handling PDF files in the Digital Library
 */

/**
 * Converts a PDF blob URL to base64 bytes for assignment creation
 * @param blobUrl - The blob URL of the PDF file
 * @returns Promise<string> - Base64 encoded PDF data
 */
export async function convertPdfBlobToBase64(blobUrl: string): Promise<string> {
  try {
    // Fetch the blob from the URL
    const response = await fetch(blobUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF blob: ${response.status}`);
    }

    const blob = await response.blob();

    // Convert blob to base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
          const base64 = reader.result.split(",")[1];
          resolve(base64);
        } else {
          reject(new Error("Failed to convert blob to base64"));
        }
      };
      reader.onerror = () => reject(new Error("FileReader error"));
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting PDF blob to base64:", error);
    throw error;
  }
}

/**
 * Creates a File object from a blob URL for form data submission
 * @param blobUrl - The blob URL of the PDF file
 * @param filename - The filename for the file
 * @returns Promise<File> - File object ready for FormData
 */
export async function convertBlobToFile(
  blobUrl: string,
  filename: string
): Promise<File> {
  try {
    const response = await fetch(blobUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch blob: ${response.status}`);
    }

    const blob = await response.blob();
    return new File([blob], filename, { type: "application/pdf" });
  } catch (error) {
    console.error("Error converting blob to file:", error);
    throw error;
  }
}
