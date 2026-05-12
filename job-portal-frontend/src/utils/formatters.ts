import { ASSET_BASE_URL } from "@/lib/constants";

export function formatCurrency(value?: number | null) {
  if (value === null || value === undefined) {
    return "Not disclosed";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatSalaryRange(min?: number | null, max?: number | null) {
  if (!min && !max) {
    return "Salary not disclosed";
  }

  if (min && max) {
    return `${formatCurrency(min)} - ${formatCurrency(max)}`;
  }

  return min ? `From ${formatCurrency(min)}` : `Up to ${formatCurrency(max)}`;
}

export function formatDate(value?: string | null) {
  if (!value) {
    return "N/A";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function getAssetUrl(path?: string | null) {
  if (!path) {
    return "";
  }

  if (path.startsWith("http")) {
    return path;
  }

  return `${ASSET_BASE_URL}${path}`;
}

export function toSkillList(value?: string | null) {
  return value
    ?.split(",")
    .map((item) => item.trim())
    .filter(Boolean) || [];
}
