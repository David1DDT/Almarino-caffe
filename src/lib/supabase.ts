import { createClient } from "@supabase/supabase-js";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xialazjebhbnafcepfid.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_PxsPRHPbtqx_ljBLAO_wBg_Irl8iSgP";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// S3 Credentials provided by user for direct Supabase Storage S3 uploads
const S3_ENDPOINT = "https://xialazjebhbnafcepfid.storage.supabase.co/storage/v1/s3";
const S3_REGION = "eu-west-1";
const S3_ACCESS_KEY_ID = "24fb29ff628f0da2f627e2e195977db6";
const S3_SECRET_ACCESS_KEY = "3147360e7dba1422cee5e95f3c2770dce6dff82ad6ffdc333e070f4b13827fbe";

export const BUCKET_NAME = "almarino";
export const SUPABASE_STORAGE_URL = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}`;

export const s3Client = new S3Client({
  endpoint: S3_ENDPOINT,
  region: S3_REGION,
  credentials: {
    accessKeyId: S3_ACCESS_KEY_ID,
    secretAccessKey: S3_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
});

export interface SupabaseProduct {
  id?: number | string;
  name: string;
  category: "espresso" | "specialty" | "cold" | "beans" | "tea";
  desc: string;
  basePrice: number;
  image: string;
  created_at?: string;
}

export function getSupabaseImageUrl(imagePath: string): string {
  if (!imagePath) return "/images/soho_artisan_cafe.jpg";
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://") || imagePath.startsWith("data:")) {
    return imagePath;
  }
  if (imagePath.startsWith("products/") || imagePath.startsWith("almarino/")) {
    return `${SUPABASE_STORAGE_URL}/${imagePath}`;
  }
  if (imagePath.startsWith("/images/") || imagePath.startsWith("/")) {
    return imagePath;
  }
  return `/images/${imagePath}`;
}

export async function uploadImageToSupabase(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop() || 'jpg';
  const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}_${cleanName}`;
  const filePath = `products/${fileName}`;
  const mimeType = file.type || "image/jpeg";

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: filePath,
      Body: buffer,
      ContentType: mimeType,
    });

    await s3Client.send(command);

    // Return the public Supabase Storage URL
    return `${SUPABASE_STORAGE_URL}/${filePath}`;
  } catch (s3Err) {
    console.warn("S3 Upload fallback warning:", s3Err);

    // Fallback to JS SDK Storage client if S3 client fails
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
        contentType: mimeType,
      });

    if (!uploadError) {
      const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
      return data.publicUrl;
    }

    // Final fallback to Data URL for preview
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }
}

export async function uploadLocalImageToStorage(imagePath: string): Promise<string> {
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  try {
    const response = await fetch(imagePath);
    if (!response.ok) return getSupabaseImageUrl(imagePath);
    const blob = await response.blob();
    const fileName = imagePath.split("/").pop() || "image.jpg";
    const file = new File([blob], fileName, { type: blob.type || "image/jpeg" });
    return await uploadImageToSupabase(file);
  } catch (err) {
    console.warn("Failed to upload local image to storage:", err);
    return getSupabaseImageUrl(imagePath);
  }
}
