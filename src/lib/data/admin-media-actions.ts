"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { PROPERTY_DOC_BUCKET, PROPERTY_IMAGE_BUCKET } from "@/lib/data/media-constants";

function requireAdminClient() {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY nao configurada.");
  }

  return supabase;
}

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getNumber(formData: FormData, key: string) {
  const value = getString(formData, key);
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : 0;
}

function getBoolean(formData: FormData, key: string) {
  return getString(formData, key) === "on" || getString(formData, key) === "true";
}

function redirectWithError(target: string, message: string) {
  redirect(`${target}?error=${encodeURIComponent(message)}`);
}

function sanitizeFileName(fileName: string) {
  return fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function buildStoragePath(folder: string, fileName: string) {
  return `properties/${folder}/${Date.now()}-${randomUUID()}-${sanitizeFileName(fileName)}`;
}

async function getPropertySlugAndRedirectPaths(propertyId: string) {
  const supabase = requireAdminClient();
  const { data, error } = await supabase.from("properties").select("slug").eq("id", propertyId).maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return {
    slug: data?.slug ?? null,
    adminPath: `/admin/imoveis/${propertyId}`,
    publicPath: data?.slug ? `/imoveis/${data.slug}` : null,
  };
}

function revalidatePropertyMedia(propertyId: string, slug?: string | null) {
  revalidatePath(`/admin/imoveis/${propertyId}`);
  revalidatePath("/admin/imoveis");
  if (slug) {
    revalidatePath(`/imoveis/${slug}`);
  }
}

const allowedImageMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const allowedDocumentMimeTypes = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export async function uploadPropertyImageAction(formData: FormData) {
  const supabase = requireAdminClient();
  const target = getString(formData, "redirect_to") || "/admin/imoveis";
  const propertyId = getString(formData, "property_id");
  const fileValue = formData.get("image_file");
  const caption = getString(formData, "caption");
  const credit = getString(formData, "credit");
  const altFallback = getString(formData, "alt_fallback");
  const isPublic = getBoolean(formData, "is_public");
  const isCover = getBoolean(formData, "is_cover");
  const position = getNumber(formData, "position");

  if (!propertyId) {
    redirectWithError(target, "Imovel invalido.");
  }

  if (!(fileValue instanceof File) || fileValue.size === 0) {
    redirectWithError(target, "Envie um arquivo de imagem.");
  }

  const imageFile = fileValue as File;

  if (!allowedImageMimeTypes.has(imageFile.type)) {
    redirectWithError(target, "Imagem precisa ser JPEG, PNG ou WebP.");
  }

  const { slug } = await getPropertySlugAndRedirectPaths(propertyId);
  const storagePath = buildStoragePath("images", imageFile.name);
  const arrayBuffer = await imageFile.arrayBuffer();
  const { error: uploadError } = await supabase.storage.from(PROPERTY_IMAGE_BUCKET).upload(storagePath, new Uint8Array(arrayBuffer), {
    contentType: imageFile.type,
    upsert: false,
  });

  if (uploadError) {
    redirectWithError(target, uploadError.message);
  }

  const { data: publicUrlData } = supabase.storage.from(PROPERTY_IMAGE_BUCKET).getPublicUrl(storagePath);
  const altText = caption || altFallback || imageFile.name;

  const { data: inserted, error } = await supabase
    .from("property_images")
    .insert({
      property_id: propertyId,
      image_url: publicUrlData.publicUrl,
      alt_text: altText,
      caption: caption || null,
      credit: credit || null,
      storage_path: storagePath,
      is_public: isPublic,
      is_cover: isCover,
      position,
    })
    .select("id")
    .single();

  const insertedId = inserted?.id;

  if (error || !insertedId) {
    await supabase.storage.from(PROPERTY_IMAGE_BUCKET).remove([storagePath]);
    redirectWithError(target, error?.message ?? "Falha ao criar imagem.");
  }

  if (isCover) {
    await supabase.from("property_images").update({ is_cover: false }).eq("property_id", propertyId).neq("id", insertedId);
    await supabase.from("property_images").update({ is_cover: true }).eq("id", insertedId);
  }

  revalidatePropertyMedia(propertyId, slug);
  redirect(`${target}?saved=1`);
}

export async function savePropertyImageAction(formData: FormData) {
  const supabase = requireAdminClient();
  const target = getString(formData, "redirect_to") || "/admin/imoveis";
  const propertyId = getString(formData, "property_id");
  const imageId = getString(formData, "image_id");
  const caption = getString(formData, "caption");
  const credit = getString(formData, "credit");
  const altFallback = getString(formData, "alt_fallback");
  const isPublic = getBoolean(formData, "is_public");
  const isCover = getBoolean(formData, "is_cover");
  const position = getNumber(formData, "position");

  if (!propertyId || !imageId) {
    redirectWithError(target, "Imagem invalida.");
  }

  const { slug } = await getPropertySlugAndRedirectPaths(propertyId);
  const { error } = await supabase
    .from("property_images")
    .update({
      alt_text: caption || altFallback || "Imagem editorial",
      caption: caption || null,
      credit: credit || null,
      is_public: isPublic,
      is_cover: isCover,
      position,
    })
    .eq("id", imageId)
    .eq("property_id", propertyId);

  if (error) {
    redirectWithError(target, error.message);
  }

  if (isCover) {
    await supabase.from("property_images").update({ is_cover: false }).eq("property_id", propertyId).neq("id", imageId);
    await supabase.from("property_images").update({ is_cover: true }).eq("id", imageId);
  }

  revalidatePropertyMedia(propertyId, slug);
  redirect(`${target}?saved=1`);
}

export async function deletePropertyImageAction(formData: FormData) {
  const supabase = requireAdminClient();
  const target = getString(formData, "redirect_to") || "/admin/imoveis";
  const propertyId = getString(formData, "property_id");
  const imageId = getString(formData, "image_id");

  if (!propertyId || !imageId) {
    redirectWithError(target, "Imagem invalida.");
  }

  const { data: row, error: fetchError } = await supabase
    .from("property_images")
    .select("storage_path")
    .eq("id", imageId)
    .eq("property_id", propertyId)
    .maybeSingle();

  if (fetchError) {
    redirectWithError(target, fetchError.message);
  }

  const { slug } = await getPropertySlugAndRedirectPaths(propertyId);

  if (row?.storage_path) {
    await supabase.storage.from(PROPERTY_IMAGE_BUCKET).remove([row.storage_path]);
  }

  const { error } = await supabase.from("property_images").delete().eq("id", imageId).eq("property_id", propertyId);

  if (error) {
    redirectWithError(target, error.message);
  }

  revalidatePropertyMedia(propertyId, slug);
  redirect(`${target}?saved=1`);
}

export async function uploadPropertyDocumentAction(formData: FormData) {
  const supabase = requireAdminClient();
  const target = getString(formData, "redirect_to") || "/admin/imoveis";
  const propertyId = getString(formData, "property_id");
  const fileValue = formData.get("document_file");
  const title = getString(formData, "title");
  const documentType = getString(formData, "document_type");
  const summary = getString(formData, "summary");
  const sourceUrl = getString(formData, "source_url");
  const isPublic = getBoolean(formData, "is_public");
  const position = getNumber(formData, "position");

  if (!propertyId) {
    redirectWithError(target, "Imovel invalido.");
  }

  if (!title || !documentType) {
    redirectWithError(target, "Preencha titulo e tipo do documento.");
  }

  if (!(fileValue instanceof File) || fileValue.size === 0) {
    redirectWithError(target, "Envie um arquivo de documento.");
  }

  const documentFile = fileValue as File;

  if (!allowedDocumentMimeTypes.has(documentFile.type)) {
    redirectWithError(target, "Documento precisa ser PDF, DOC, DOCX ou imagem de apoio.");
  }

  const { slug } = await getPropertySlugAndRedirectPaths(propertyId);
  const storagePath = buildStoragePath("docs", documentFile.name);
  const arrayBuffer = await documentFile.arrayBuffer();
  const { error: uploadError } = await supabase.storage.from(PROPERTY_DOC_BUCKET).upload(storagePath, new Uint8Array(arrayBuffer), {
    contentType: documentFile.type,
    upsert: false,
  });

  if (uploadError) {
    redirectWithError(target, uploadError.message);
  }

  const { error } = await supabase.from("property_documents").insert({
    property_id: propertyId,
    title,
    summary: summary || null,
    document_type: documentType,
    published_year: new Date().getFullYear(),
    document_url: null,
    storage_path: storagePath,
    file_name: documentFile.name,
    source_url: sourceUrl || null,
    is_public: isPublic,
    position,
  });

  if (error) {
    await supabase.storage.from(PROPERTY_DOC_BUCKET).remove([storagePath]);
    redirectWithError(target, error.message);
  }

  revalidatePropertyMedia(propertyId, slug);
  redirect(`${target}?saved=1`);
}

export async function savePropertyDocumentAction(formData: FormData) {
  const supabase = requireAdminClient();
  const target = getString(formData, "redirect_to") || "/admin/imoveis";
  const propertyId = getString(formData, "property_id");
  const documentId = getString(formData, "document_id");
  const title = getString(formData, "title");
  const documentType = getString(formData, "document_type");
  const summary = getString(formData, "summary");
  const sourceUrl = getString(formData, "source_url");
  const isPublic = getBoolean(formData, "is_public");
  const position = getNumber(formData, "position");

  if (!propertyId || !documentId) {
    redirectWithError(target, "Documento invalido.");
  }

  if (!title || !documentType) {
    redirectWithError(target, "Preencha titulo e tipo do documento.");
  }

  const { slug } = await getPropertySlugAndRedirectPaths(propertyId);
  const { error } = await supabase
    .from("property_documents")
    .update({
      title,
      summary: summary || null,
      document_type: documentType,
      source_url: sourceUrl || null,
      is_public: isPublic,
      position,
    })
    .eq("id", documentId)
    .eq("property_id", propertyId);

  if (error) {
    redirectWithError(target, error.message);
  }

  revalidatePropertyMedia(propertyId, slug);
  redirect(`${target}?saved=1`);
}

export async function deletePropertyDocumentAction(formData: FormData) {
  const supabase = requireAdminClient();
  const target = getString(formData, "redirect_to") || "/admin/imoveis";
  const propertyId = getString(formData, "property_id");
  const documentId = getString(formData, "document_id");

  if (!propertyId || !documentId) {
    redirectWithError(target, "Documento invalido.");
  }

  const { data: row, error: fetchError } = await supabase
    .from("property_documents")
    .select("storage_path")
    .eq("id", documentId)
    .eq("property_id", propertyId)
    .maybeSingle();

  if (fetchError) {
    redirectWithError(target, fetchError.message);
  }

  const { slug } = await getPropertySlugAndRedirectPaths(propertyId);

  if (row?.storage_path) {
    await supabase.storage.from(PROPERTY_DOC_BUCKET).remove([row.storage_path]);
  }

  const { error } = await supabase.from("property_documents").delete().eq("id", documentId).eq("property_id", propertyId);

  if (error) {
    redirectWithError(target, error.message);
  }

  revalidatePropertyMedia(propertyId, slug);
  redirect(`${target}?saved=1`);
}

export async function uploadQuickImageAction(formData: FormData) {
  try {
    const supabase = requireAdminClient();
    const propertyId = getString(formData, "property_id");
    const fileValue = formData.get("image_file");
    const caption = getString(formData, "caption") || "Imagem editorial";
    const credit = getString(formData, "credit") || null;
    const isCover = getBoolean(formData, "is_cover");

    if (!propertyId) {
      return { success: false, error: "Imóvel inválido para upload." };
    }

    if (!(fileValue instanceof File) || fileValue.size === 0) {
      return { success: false, error: "Envie um arquivo de imagem." };
    }

    const imageFile = fileValue as File;
    if (!allowedImageMimeTypes.has(imageFile.type)) {
      return { success: false, error: "Imagem precisa ser JPEG, PNG ou WebP." };
    }

    const { slug } = await getPropertySlugAndRedirectPaths(propertyId);
    const storagePath = buildStoragePath("images", imageFile.name);
    const arrayBuffer = await imageFile.arrayBuffer();
    
    const { error: uploadError } = await supabase.storage
      .from(PROPERTY_IMAGE_BUCKET)
      .upload(storagePath, new Uint8Array(arrayBuffer), {
        contentType: imageFile.type,
        upsert: false,
      });

    if (uploadError) {
      return { success: false, error: uploadError.message };
    }

    const { data: publicUrlData } = supabase.storage.from(PROPERTY_IMAGE_BUCKET).getPublicUrl(storagePath);
    
    // Check if a cover image exists
    const { data: covers } = await supabase
      .from("property_images")
      .select("id")
      .eq("property_id", propertyId)
      .eq("is_cover", true)
      .limit(1);
    const coverExists = (covers ?? []).length > 0;

    // Get next position
    const { data: lastImg } = await supabase
      .from("property_images")
      .select("position")
      .eq("property_id", propertyId)
      .order("position", { ascending: false })
      .limit(1)
      .maybeSingle();
    const position = (lastImg?.position ?? -1) + 1;

    const { data: inserted, error: insertError } = await supabase
      .from("property_images")
      .insert({
        property_id: propertyId,
        image_url: publicUrlData.publicUrl,
        alt_text: caption,
        caption: caption || null,
        credit: credit || null,
        storage_path: storagePath,
        is_public: true,
        is_cover: isCover || !coverExists,
        position,
      })
      .select("*")
      .single();

    if (insertError || !inserted) {
      await supabase.storage.from(PROPERTY_IMAGE_BUCKET).remove([storagePath]);
      return { success: false, error: insertError?.message ?? "Falha ao criar registro da imagem." };
    }

    if (inserted.is_cover) {
      await supabase.from("property_images").update({ is_cover: false }).eq("property_id", propertyId).neq("id", inserted.id);
    }

    revalidatePropertyMedia(propertyId, slug);
    return { success: true, image: inserted };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido no upload.";
    return { success: false, error: message };
  }
}
