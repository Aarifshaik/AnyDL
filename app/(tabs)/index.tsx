import React, { useState } from "react";
import { View, TextInput, Button, Text, TouchableOpacity } from "react-native";
import * as Clipboard from "expo-clipboard";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';

type ResponseType = {
  error?: string;
  [key: string]: any;
};

export default function HomeScreen() {
  const [link, setLink] = useState("");
  const [response, setResponse] = useState<ResponseType | null>(null);

  const pasteFromClipboard = async () => {
    const clipboardContent = await Clipboard.getStringAsync();
    setLink(clipboardContent);
  };

// const fetchVideo = async () => {
//   if (!link) return;

//   try {
//     const res = await fetch("http://127.0.0.1:10000/download", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ url: link }),
//     });

//     if (!res.ok) {
//       throw new Error("Failed to fetch video");
//     }

//     // Get filename from content-disposition header
//     const contentDisposition = res.headers.get("content-disposition");
//     let filename = "video.mp4"; // Default filename

//     if (contentDisposition) {
//       const match = contentDisposition.match(/filename="(.+)"/);
//       if (match) filename = match[1];
//     }

//     filename = filename.replace(/\s+/g, "_"); // Remove spaces

//     // Save file to local storage
//     const fileUri = FileSystem.documentDirectory + filename;
//     const fileData = await res.blob();
//     await FileSystem.writeAsStringAsync(fileUri, await fileData.text(), {
//       encoding: FileSystem.EncodingType.Base64,
//     });

//     Alert.alert("Download Complete", "Video saved successfully");

//     // Optionally open the file for sharing
//     if (await Sharing.isAvailableAsync()) {
//       await Sharing.shareAsync(fileUri);
//     }

//   } catch (error) {
//     Alert.alert("Error", (error as Error).message);
//   }
// };

const fetchVideo = async () => {
  if (!link) return;

  try {
    const res = await fetch("http://127.0.0.1:10000/download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: link }),
    });

    if (!res.ok) {
      throw new Error("Failed to fetch video");
    }

    const blob = await res.blob();

    // Extract filename from response headers
    const contentDisposition = res.headers.get("content-disposition");
    let filename = "video.mp4";

    if (contentDisposition) {
      const match = contentDisposition.match(/filename="(.+)"/);
      if (match) filename = match[1];
    }

    filename = filename.replace(/\s+/g, "_"); // Remove spaces

    // Create a download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    alert("Download started!");

  } catch (error) {
    if (error instanceof Error) {
      alert("Error: " + error.message);
    } else {
      alert("An unknown error occurred");
    }
  }
};



  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Enter Video Link:</Text>
      <View style={{ flexDirection: "row", alignItems: "center", width: "100%" }}>
        <TextInput
          style={{ flex: 1, borderWidth: 1, padding: 10, borderRadius: 5 }}
          value={link}
          onChangeText={setLink}
          placeholder="Paste the link here"
        />
        <TouchableOpacity onPress={pasteFromClipboard} style={{ marginLeft: 10, padding: 10, backgroundColor: "#ccc", borderRadius: 5 }}>
          <Text>Paste</Text>
        </TouchableOpacity>
      </View>
      <View style={{ marginTop: 10 }}>
        <Button title="Get" onPress={fetchVideo} />
      </View>
      {response && <Text style={{ marginTop: 10 }}>{JSON.stringify(response)}</Text>}
    </View>
  );
}