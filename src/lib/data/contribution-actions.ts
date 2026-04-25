"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { isContributionReportType } from "@/lib/data/contribution-options";

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

function buildAttachmentPath(reportType: string, fileName: string) {
  return `contributions/${reportType}/${Date.now()}-${randomUUID()}-${sanitizeFileName(fileName)}`;
}

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);

const maxAttachmentSize = 12 * 1024 * 1024;

export async function submitContributionAction(formData: FormData) {
  const supabase = requireAdminClient();
  const target = "/enviar";
  const website = getString(formData, "website");
  const reportType = getString(formData, "report_type");
  const propertyId = getString(formData, "property_id") || null;
  const authorName = getString(formData, "author_name");
  const contact = getString(formData, "contact");
  const title = getString(formData, "title");
  const content = getString(formData, "content");
  const sourceUrl = getString(formData, "source_url");
  const referenceHint = getString(formData, "reference_hint");
  const attachmentValue = formData.get("attachment");
  const attachment = attachmentValue instanceof File && attachmentValue.size > 0 ? attachmentValue : null;

  if (website) {
    redirect(`${target}?sent=1`);
  }

  if (!isContributionReportType(reportType)) {
    redirectWithError(target, "Selecione um tipo de envio valido.");
  }

  if (!content || !title) {
    redirectWithError(target, "Preencha titulo e relato antes de enviar.");
  }

  if (propertyId) {
    const { data: propertyRow, error: propertyError } = await supabase
      .from("properties")
      .select("id")
      .eq("id", propertyId)
      .maybeSingle();

    if (propertyError) {
      redirectWithError(target, propertyError.message);
    }

    if (!propertyRow) {
      redirectWithError(target, "Imovel relacionado nao encontrado.");
    }
  }

  let attachmentPath: string | null = null;
  let uploadedFileName: string | null = null;
  let uploadedMimeType: string | null = null;
  let uploadedSize: number | null = null;

  if (attachment) {
    if (attachment.size > maxAttachmentSize) {
      redirectWithError(target, "Anexo excede o limite de 12 MB.");
    }

    if (!allowedMimeTypes.has(attachment.type)) {
      redirectWithError(target, "Anexo precisa ser imagem JPEG/PNG/WebP ou PDF.");
    }

    attachmentPath = buildAttachmentPath(reportType, attachment.name);
    uploadedFileName = attachment.name;
    uploadedMimeType = attachment.type;
    uploadedSize = attachment.size;

    const arrayBuffer = await attachment.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const { error: uploadError } = await supabase.storage.from("report-attachments").upload(attachmentPath, bytes, {
      contentType: attachment.type,
      upsert: false,
    });

    if (uploadError) {
      redirectWithError(target, `Falha ao enviar anexo: ${uploadError.message}`);
    }
  }

  const { error } = await supabase.from("property_reports").insert({
    property_id: propertyId,
    profile_id: null,
    report_type: reportType,
    author_name: authorName || null,
    contact: contact || null,
    title,
    content,
    source_url: sourceUrl || null,
    reference_hint: referenceHint || "",
    moderation_status: "pendente",
    attachment_path: attachmentPath,
    attachment_name: uploadedFileName,
    attachment_mime_type: uploadedMimeType,
    attachment_size: uploadedSize,
  });

  if (error) {
    if (attachmentPath) {
      await supabase.storage.from("report-attachments").remove([attachmentPath]);
    }

    redirectWithError(target, error.message);
  }

  revalidatePath("/admin/contribuicoes");
  revalidatePath("/admin");

  redirect("/enviar?sent=1");
}
