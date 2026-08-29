/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { type FormEvent, useEffect, useState } from "react";
import { Card, Header, FoundCryptoLogo, FoundRetailLogo } from "@founder-os/ui";
import { FoundThisBrandMark, FoundMeatBrandMark, FoundTalentBrandMark } from "@founder-os/brand-assets";
import { authClient } from "./auth";

type CompanyModule = { module: string; enabled: boolean };
type Company = {
  id: string;
  name: string;
  slug: string;
  publicWebsiteUrl?: string | null;
  ownerConsoleUrl?: string | null;
  merchantConsoleUrl?: string | null;
  active: boolean;
  settings?: {
    brandColor?: string;
    ownerAccess?: boolean;
    merchantAccess?: boolean;
  };
  modules: CompanyModule[];
};
const modules = ["foundretail", "foundcrypto", "foundthis", "foundit", "foundmeat", "foundtalent"] as const;
const moduleLabel = (module: (typeof modules)[number]) =>
  module === "foundretail"
    ? "FoundRetail"
    : module === "foundcrypto"
      ? "FoundCrypto"
    :     module === "foundthis" || module === "foundit"
      ? "FoundThis"
      : module === "foundmeat"
        ? "FoundMeat"
        : "FoundTalent";

export function CompanyManagement() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [message, setMessage] = useState("");
  const load = async () => {
    try {
      setCompanies(
        (
          await authClient.request<{ success: true; data: Company[] }>(
            "/companies",
          )
        ).data,
      );
      setMessage("");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to load companies",
      );
    }
  };
  useEffect(() => {
    void load();
  }, []);
  const create = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      await authClient.request("/companies", {
        method: "POST",
        body: JSON.stringify({
          name: data.get("name"),
          publicWebsiteUrl: data.get("publicWebsiteUrl"),
          ownerConsoleUrl: data.get("ownerConsoleUrl"),
          merchantConsoleUrl: data.get("merchantConsoleUrl"),
          settings: {
            brandColor: data.get("brandColor"),
            ownerAccess: true,
            merchantAccess: true,
          },
          modules: Object.fromEntries(
            modules.map((module) => [module, data.get(module) === "on"]),
          ),
        }),
      });
      form.reset();
      await load();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to create company",
      );
    }
  };
  const update = async (company: Company, patch: Record<string, unknown>) => {
    try {
      await authClient.request(`/companies/${company.id}`, {
        method: "PATCH",
        body: JSON.stringify(patch),
      });
      await load();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to update company",
      );
    }
  };
  return (
    <div className="space-y-7">
      <Header
        eyebrow="FoundingOS Control Centre"
        title="Company management"
        description="Create companies and apply branding, permissions, public websites, and module access consistently across the ecosystem."
      />
      <Card title="Create company">
        <form
          onSubmit={create}
          className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
        >
          <label className="grid gap-2 text-sm font-semibold">
            Company name
            <input
              name="name"
              required
              className="rounded border border-[var(--line)] px-3 py-2"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Public website URL
            <input
              name="publicWebsiteUrl"
              type="url"
              placeholder="Enter public website URL"
              className="rounded border border-[var(--line)] px-3 py-2"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Primary Console URL
            <input
              name="ownerConsoleUrl"
              type="url"
              placeholder="Enter Primary Console URL"
              className="rounded border border-[var(--line)] px-3 py-2"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Secondary Console URL
            <input
              name="merchantConsoleUrl"
              type="url"
              placeholder="Enter Secondary Console URL"
              className="rounded border border-[var(--line)] px-3 py-2"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Brand colour
            <input
              name="brandColor"
              type="color"
              defaultValue="#006CFF"
              className="h-10 w-full border border-[var(--line)]"
            />
          </label>
          <div className="flex flex-wrap items-end gap-4">
            {modules.map((module) => (
              <label
                key={module}
                className="flex items-center gap-2 pb-2 text-sm font-semibold"
              >
                <input type="checkbox" name={module} />
                {module === "foundretail"
                  ? "FoundRetail"
                  : module === "foundcrypto"
                    ? "FoundCrypto"
                    : module === "foundthis" || module === "foundit"
                      ? "FoundThis"
                      : "FoundMeat"}
              </label>
            ))}
            <button className="rounded bg-[var(--primary)] px-5 py-2 font-semibold text-white">
              Create
            </button>
          </div>
        </form>
      </Card>
      {message && (
        <p
          role="alert"
          className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {message}
        </p>
      )}
      <div className="grid gap-4 lg:grid-cols-2">
        {companies.map((company) => (
          <Card key={company.id} title={company.name}>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {company.slug === "foundretail" ? (
                  <FoundRetailLogo className="h-9 w-9" />
                ) : company.slug === "foundcrypto" ? (
                  <FoundCryptoLogo className="h-9 w-9" />
                ) : company.slug === "foundthis" || company.slug === "foundit" ? (
                  <FoundThisBrandMark className="h-9 w-9" />
                ) : company.slug === "foundmeat" ? (
                  <FoundMeatBrandMark className="h-9 w-9" />
                ) : company.slug === "foundtalent" ? (
                  <FoundTalentBrandMark className="h-9 w-9" />
                ) : (
                  <span
                    className="h-9 w-9 border border-[var(--line)]"
                    style={{
                      background: company.settings?.brandColor || (company.slug === "foundcrypto" ? "#7C3AED" : "#006CFF"),
                    }}
                  />
                )}
                <div>
                  <p className="text-sm text-[var(--muted)]">{company.slug}</p>
                  <p className="mt-1 text-sm font-semibold">
                    {company.active ? "Active" : "Suspended"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  void update(company, { active: !company.active })
                }
                className="rounded border border-[var(--line)] px-3 py-2 text-sm font-semibold"
              >
                {company.active ? "Suspend" : "Activate"}
              </button>
            </div>
            <div className="mt-5 grid gap-2 sm:grid-cols-3">
              {modules.map((module) => {
                const enabled =
                  company.modules.find((item) => item.module === module)
                    ?.enabled ?? false;
                return (
                  <label
                    key={module}
                    className="flex items-center gap-2 rounded border border-[var(--line)] p-3 text-sm font-semibold"
                  >
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={() =>
                        void update(company, {
                          modules: { [module]: !enabled },
                        })
                      }
                    />
                    {moduleLabel(module)}
                  </label>
                );
              })}
            </div>
            <div className="mt-4 grid gap-3 border-t border-[var(--line)] pt-4 sm:grid-cols-3">
              <label className="grid gap-1 text-xs font-semibold">
                Brand colour
                <input
                  type="color"
                  value={company.slug === "foundthis" || company.slug === "foundit" ? "#FFD600" : company.slug === "foundtalent" ? "#F97316" : company.slug === "foundcrypto" ? "#7C3AED" : company.slug === "foundretail" ? "#25D366" : company.settings?.brandColor || "#006CFF"}
                  disabled={company.slug === "foundthis" || company.slug === "foundit" || company.slug === "foundtalent" || company.slug === "foundcrypto" || company.slug === "foundretail"}
                  onChange={(event) =>
                    void update(company, {
                      settings: {
                        ...company.settings,
                        brandColor: event.target.value,
                      },
                    })
                  }
                  className="h-9 w-full disabled:cursor-not-allowed"
                />
              </label>
              <label className="flex items-center gap-2 text-sm font-semibold">
                <input
                  type="checkbox"
                  checked={company.settings?.ownerAccess !== false}
                  onChange={(event) =>
                    void update(company, {
                      settings: {
                        ...company.settings,
                        ownerAccess: event.target.checked,
                      },
                    })
                  }
                />
                Manager access
              </label>
              <label className="flex items-center gap-2 text-sm font-semibold">
                <input
                  type="checkbox"
                  checked={company.settings?.merchantAccess !== false}
                  onChange={(event) =>
                    void update(company, {
                      settings: {
                        ...company.settings,
                        merchantAccess: event.target.checked,
                      },
                    })
                  }
                />
                Staff access
              </label>
            </div>
            <div className="mt-4 grid gap-3 border-t border-[var(--line)] pt-4 md:grid-cols-3">
              {[
                ["Public website URL", "publicWebsiteUrl", company.publicWebsiteUrl],
                ["Primary Console URL", "ownerConsoleUrl", company.ownerConsoleUrl],
                ["Secondary Console URL", "merchantConsoleUrl", company.merchantConsoleUrl],
              ].map(([label, field, value]) => (
                <label key={field} className="grid gap-1 text-xs font-semibold">
                  {label}
                  <input
                    type="url"
                    defaultValue={value || ""}
                    placeholder="Link not available"
                    onBlur={(event) => void update(company, { [field!]: event.target.value })}
                    className="rounded border border-[var(--line)] px-3 py-2 text-sm font-normal"
                  />
                </label>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
