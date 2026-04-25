import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { PROPERTY_DOC_BUCKET, PROPERTY_IMAGE_BUCKET } from "@/lib/data/media-constants";

export interface AdminPropertyImageMedia {
  id: string;
  propertyId: string;
  imageUrl: string;
  altText: string;
  caption: string | null;
  credit: string | null;
  storagePath: string | null;
  isPublic: boolean;
  isCover: boolean;
  position: number;
  previewUrl: string;
}

export interface AdminPropertyDocumentMedia {
  id: string;
  propertyId: string;
  title: string;
  summary: string | null;
  documentType: string;
  publishedYear: number | null;
  documentUrl: string | null;
  storagePath: string | null;
  fileName: string | null;
  sourceUrl: string | null;
  isPublic: boolean;
  position: number;
  previewUrl?: string;
}

export interface AdminPropertyMediaBundle {
  images: AdminPropertyImageMedia[];
  documents: AdminPropertyDocumentMedia[];
}

interface AdminPropertyImageRow {
  id: string;
  property_id: string;
  image_url: string;
  alt_text: string;
  caption: string | null;
  credit: string | null;
  storage_path: string | null;
  is_public: boolean | null;
  is_cover: boolean | null;
  position: number;
}

interface AdminPropertyDocumentRow {
  id: string;
  property_id: string;
  title: string;
  summary: string | null;
  document_type: string;
  published_year: number | null;
  document_url: string | null;
  storage_path: string | null;
  file_name: string | null;
  source_url: string | null;
  is_public: boolean | null;
  position: number;
}

function getAdminSupabaseOrThrow() {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY nao configurada.");
  }

  return supabase;
}

async function resolveImagePreviewUrl(storagePath: string | null, imageUrl: string) {
  if (!storagePath) {
    return imageUrl;
  }

  const supabase = getAdminSupabaseOrThrow();
  const { data } = supabase.storage.from(PROPERTY_IMAGE_BUCKET).getPublicUrl(storagePath);

  return data.publicUrl || imageUrl;
}

async function resolveDocumentPreviewUrl(row: AdminPropertyDocumentRow) {
  if (row.storage_path) {
    const supabase = getAdminSupabaseOrThrow();
    const { data } = await supabase.storage.from(PROPERTY_DOC_BUCKET).createSignedUrl(row.storage_path, 60 * 30);

    return data?.signedUrl ?? row.document_url ?? row.source_url ?? undefined;
  }

  if (row.document_url) {
    return row.document_url;
  }

  if (row.source_url) {
    return row.source_url;
  }

  return undefined;
}

export async function getAdminPropertyMedia(propertyId: string): Promise<AdminPropertyMediaBundle> {
  const supabase = getAdminSupabaseOrThrow();
  const [imagesResult, documentsResult] = await Promise.all([
    supabase
      .from("property_images")
      .select("id, property_id, image_url, alt_text, caption, credit, storage_path, is_public, is_cover, position")
      .eq("property_id", propertyId)
      .order("position", { ascending: true })
      .returns<AdminPropertyImageRow[]>(),
    supabase
      .from("property_documents")
      .select("id, property_id, title, summary, document_type, published_year, document_url, storage_path, file_name, source_url, is_public, position")
      .eq("property_id", propertyId)
      .order("position", { ascending: true })
      .returns<AdminPropertyDocumentRow[]>(),
  ]);

  for (const result of [imagesResult, documentsResult]) {
    if (result.error) {
      throw new Error(result.error.message);
    }
  }

  const images = await Promise.all(
    (imagesResult.data ?? []).map(async (row) => ({
      id: row.id,
      propertyId: row.property_id,
      imageUrl: row.image_url,
      altText: row.alt_text,
      caption: row.caption,
      credit: row.credit,
      storagePath: row.storage_path,
      isPublic: row.is_public ?? true,
      isCover: row.is_cover ?? false,
      position: row.position,
      previewUrl: await resolveImagePreviewUrl(row.storage_path, row.image_url),
    })),
  );

  const documents = await Promise.all(
    (documentsResult.data ?? []).map(async (row) => ({
      id: row.id,
      propertyId: row.property_id,
      title: row.title,
      summary: row.summary,
      documentType: row.document_type,
      publishedYear: row.published_year,
      documentUrl: row.document_url,
      storagePath: row.storage_path,
      fileName: row.file_name,
      sourceUrl: row.source_url,
      isPublic: row.is_public ?? false,
      position: row.position,
      previewUrl: await resolveDocumentPreviewUrl(row),
    })),
  );

  return {
    images: images.sort((left, right) => Number(!!right.isCover) - Number(!!left.isCover) || left.position - right.position),
    documents: documents.sort((left, right) => left.position - right.position),
  };
}
